import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Shared state file — lives at project root, gitignored
const DATA_FILE = path.join(process.cwd(), ".product-tree-shared.json");

interface SharedState {
  overrides: Record<string, Record<string, unknown>>;
  changelog: unknown[];
  comments: unknown[];
  customNodes: unknown[];
  updatedAt: string;
}

function readState(): SharedState {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // corrupted file, reset
  }
  return { overrides: {}, changelog: [], comments: [], customNodes: [], updatedAt: new Date().toISOString() };
}

function writeState(state: SharedState) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// GET — read shared state
export async function GET() {
  const state = readState();
  return NextResponse.json(state);
}

// POST — write shared state
export async function POST(req: Request) {
  const body = await req.json();
  const state: SharedState = {
    overrides: body.overrides ?? {},
    changelog: body.changelog ?? [],
    comments: body.comments ?? [],
    customNodes: body.customNodes ?? [],
    updatedAt: new Date().toISOString(),
  };
  writeState(state);
  return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
}
