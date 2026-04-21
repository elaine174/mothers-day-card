import { NextResponse } from 'next/server';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

// Upstash REST API helper
async function redis(cmd: string): Promise<number> {
  const res = await fetch(`${REDIS_URL}/${cmd}`, {
    method:  'GET',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache:   'no-store',
  });
  const data = await res.json();
  return Number(data.result) || 0;
}

async function redisPost(cmd: string): Promise<number> {
  const res = await fetch(`${REDIS_URL}/${cmd}`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache:   'no-store',
  });
  const data = await res.json();
  return Number(data.result) || 0;
}

// ── GET /api/stats → { visits, saves }
export async function GET() {
  try {
    const [visits, saves] = await Promise.all([
      redis('get/md:visits'),
      redis('get/md:saves'),
    ]);
    return NextResponse.json({ visits, saves });
  } catch {
    return NextResponse.json({ visits: 0, saves: 0 });
  }
}

// ── POST /api/stats { type: 'visit' | 'save' } → { count }
export async function POST(req: Request) {
  try {
    const { type } = await req.json() as { type: 'visit' | 'save' };
    const key    = type === 'save' ? 'md:saves' : 'md:visits';
    const count  = await redisPost(`incr/${key}`);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
