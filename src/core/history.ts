import type { EditorState } from './types';
import { cloneState } from './state';

interface Entry {
  state: EditorState;
  key: string;
  at: number;
}

export class History {
  private entries: Entry[] = [];
  private index = -1;
  private limit: number;

  constructor(limit = 60) {
    this.limit = Math.max(2, limit);
  }

  reset(state: EditorState): void {
    this.entries = [{ state: cloneState(state), key: '', at: 0 }];
    this.index = 0;
  }

  /** Push a snapshot. Reusing `key` within 900 ms replaces the top entry. */
  push(state: EditorState, key = ''): void {
    const now = Date.now();
    const top = this.entries[this.index];
    if (top && key && key === top.key && now - top.at < 900) {
      top.state = cloneState(state);
      top.at = now;
      return;
    }
    this.entries = this.entries.slice(0, this.index + 1);
    this.entries.push({ state: cloneState(state), key, at: now });
    if (this.entries.length > this.limit) {
      this.entries.shift();
    }
    this.index = this.entries.length - 1;
  }

  undo(): EditorState | null {
    if (this.index <= 0) return null;
    this.index -= 1;
    return cloneState(this.entries[this.index].state);
  }

  redo(): EditorState | null {
    if (this.index >= this.entries.length - 1) return null;
    this.index += 1;
    return cloneState(this.entries[this.index].state);
  }

  get canUndo(): boolean {
    return this.index > 0;
  }

  get canRedo(): boolean {
    return this.index < this.entries.length - 1;
  }

  get depth(): number {
    return this.entries.length;
  }
}
