/**
 * Shared chat types.
 *
 * `AgentMessage` was declared privately inside ChatPanel while Message.tsx
 * imported it from `../../lib/agents/relevance` — a module that does not
 * exist. The build tolerated it because a type-only import is erased before
 * it ever runs, so the mistake only showed up in the typechecker.
 */
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolsUsed?: Record<string, unknown>;
}
