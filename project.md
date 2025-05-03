# Dartwin - a Dart Scorekeeper Web App — AI Agent Plan

## 1. Introduction
This is the project specification to hand off to an AI coding assistant. It covers tech stack, project structure, detailed feature milestones, database schema, Edge Function interfaces, and developer‑agent instructions.

---

### AI Agent Instructions
1. **Test-Driven Development**: For each new feature or function, first write unit tests that capture the desired behavior and confirm they fail, then implement code until all tests pass.
2. **One task at a time**: Scaffold migrations → write tests → implement functionality → commit.
3. **Atomic commits**: Each commit should include both tests and corresponding implementation, with clear messages like "Add tests for applyTurn halving logic" followed by "Implement applyTurn halving logic".
4. **Run tests locally** after each implementation step; ensure 100% pass before proceeding.
5. **Follow the schema and interfaces exactly**; do not deviate from the defined endpoints.
6. **Document new environment variables** in `README.md` immediately when introduced.
7. **CI Integration**: Ensure GitHub Actions runs tests before merge, enforcing TDD practice.

## 2. Tech Stack & Services

- **Frontend**
  - A modern, clean, responsive, touch‑friendly UI
  - Next.js (React) + TypeScript
  - Tailwind CSS for responsive, touch‑friendly UI
  - `@supabase/supabase-js` client
  - Recharts for stats/leaderboard visualizations

- **Backend & Auth**
  - Supabase (Postgres, Auth, Realtime, Edge Functions)
  - Edge Functions in TypeScript for game logic

- **Deployment**
  - Vercel for frontend
  - Supabase managed for database, auth, functions
  - GitHub Actions for CI (lint, test, deploy)

---

## 3. Repository Structure

```
project-root/
├── frontend/                # Next.js app
│   ├── components/          # UI components
│   │   └── Dartboard.tsx    # SVG board + click→coords logic
│   │   └── Dartboard.tsx    # SVG board + click→coords logic
│   ├── lib/                 # Supabase client
│   │   └── supabaseClient.ts
│   ├── pages/               # Routes
│   │   ├── index.tsx        # Dashboard / login
│   │   ├── new-game.tsx     # Game setup
│   │   ├── game/[id].tsx    # Live game UI
│   │   ├── leaderboard.tsx  # Leaderboards & stats
│   │   └── friends.tsx      # Manage friend list
│   └── styles/              # Tailwind config

├── supabase/                # Supabase configuration
│   ├── migrations/          # SQL for tables: users, games, throws, friendships
│   ├── policies/            # RLS policies
│   └── functions/           # Edge Functions
│       ├── lib/             # Shared scoring library
│       │   └── scoring.ts
│       ├── startGame/       # POST endpoint
│       ├── scoreTurn/       # POST endpoint
│       └── gameState/       # GET endpoint

└── README.md                # Setup & environment variables
```

---

## 4. Feature Milestones

### Milestone 1: Core Setup & Auth (Learning TypeScript & Supabase)
1. Project setup with TypeScript configurations
2. Supabase Auth setup:
   - Magic link (email) authentication
   - Optional password setup later
   - 1-click signup flow
3. Simple profile page
4. Define core TypeScript interfaces:
```typescript
enum GameType {
  THREE_ZERO_ONE = '301',
  FIVE_ZERO_ONE = '501',
  CLOCK = 'clock',
  HALVE_IT = 'halve-it'
}

interface Hit {
  segment: number;    // 0-20, 25 for bullseye
  multiplier: 1|2|3;  // single, double, triple
}

interface GameState {
  type: GameType;
  players: string[];  // array of user UUIDs
  scores: Record<string, number>;
  currentTarget: number;
  turnIndex: number;
}
```

### Milestone 2: Basic Game Setup
1. **Game Type**: dropdown for 301, 501 only (simpler first)
2. **Quick Player Add**:
   - Email-only signup form
   - Instant magic link delivery
   - Auto-join game after auth
3. **Start Game**: call Edge Function `/startGame`
4. Write first tests for game logic

### Milestone 3: Core Gameplay
1. **Score Input**: 
   - Simple numeric input first
   - Score validation
   - Turn tracking with user emails
2. **Game Flow**:
   - Basic turn management
   - Score calculations
   - Winner detection
3. **Real-time Updates**: 
   - Supabase real-time subscriptions
   - Player presence indicators
4. **Game Completion**: 
   - Stats recording
   - Quick rematch option with same players

### Milestone 4: Advanced Features
1. **Interactive Board**:
   - SVG dartboard implementation
   - Touch/click score input
2. **Game Variants**:
   - Around-the-Clock implementation
   - Additional scoring rules
3. **Player Profiles**:
   - Optional password setup
   - Basic stats display
   - Game history
4. **Social Features**:
   - Add frequent players to friends
   - Quick game setup with friends

### Milestone 5: Polish & Deploy
1. **Testing**: 
   - Core game logic unit tests
   - Auth flow testing
   - Real-time update tests
2. **Deployment**:
   - Vercel setup
   - Supabase production config
   - Environment variables
3. **Mobile UI**: 
   - Responsive design
   - Touch-friendly controls
   - PWA setup
4. **Documentation**: 
   - Setup guide
   - Game rules
   - User guide

## 5. Database Schema

```sql
-- users: provided by Supabase Auth

CREATE TABLE friendships (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester uuid REFERENCES auth.users(id),
  accepter  uuid REFERENCES auth.users(id),
  status    text CHECK(status IN ('pending','accepted')),
  created_at timestamp DEFAULT now()
);

CREATE TABLE games (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type          text CHECK(type IN ('301','501','clock','halve-it')) NOT NULL,
  players       uuid[] NOT NULL,  -- Array of Supabase user UUIDs
  current_status jsonb NOT NULL,  -- matches GameState
  created_at    timestamp DEFAULT now()
);

CREATE TABLE throws (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id       uuid REFERENCES games(id) ON DELETE CASCADE,
  player_id     uuid REFERENCES auth.users(id),
  turn_index    int,
  throw_index   int CHECK(throw_index BETWEEN 0 AND 2),
  segment       int CHECK(segment BETWEEN 0 AND 25),
  multiplier    int CHECK(multiplier BETWEEN 1 AND 3),
  scored_points int,
  created_at    timestamp DEFAULT now()
);

-- Basic RLS policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE throws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their games"
  ON games FOR SELECT
  USING (auth.uid() = ANY(players));

CREATE POLICY "Users can insert throws in their games"
  ON throws FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM games 
    WHERE games.id = throws.game_id 
    AND auth.uid() = ANY(players)
  ));
```

## 6. Edge Function Interfaces

### 6.1 `/startGame` (POST)
- **Body**: `{ type: GameType, players: string[], startTarget?: number }`
- **Action**: Insert `games` with initial `current_status`:
  ```ts
  {
    type,
    players,
    scores: players.reduce((o,id)=>(o[id]= type==='501'?501:301,o),{}),
    currentTarget: startTarget||1,
    turnIndex: 0
  }
  ```
- **Response**: { gameId, initialState }

### 6.2 `/scoreTurn` (POST)
- **Body**: `{ gameId: string, hits: Hit[3] }`
- **Action**:
  1. Validate input (multiplier & segment ranges)
  2. Load `current_status` from `games`
  3. Verify correct player's turn
  4. Insert three rows into `throws`
  5. Call `applyTurn()` → `{ nextState, winner }`
  6. Update `games.current_status = nextState`
- **Response**: `{ nextState, winner } | { error: string }`

### 6.3 `/gameState` (GET)
- **Query**: `?gameId=…`  
- **Response**: `{ current_status }`

---
