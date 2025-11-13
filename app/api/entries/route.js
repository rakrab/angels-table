import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const entries = await db.all('SELECT * FROM entries ORDER BY created_at DESC');
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, is_internal, created_at } = await request.json();
    
    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (is_internal !== 0 && is_internal !== 1) {
      return NextResponse.json(
        { error: 'is_internal must be 0 or 1' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // If created_at is provided, use it; otherwise let database use default
    let result;
    if (created_at) {
      result = await db.run(
        'INSERT INTO entries (name, description, is_internal, created_at) VALUES (?, ?, ?, ?)',
        [name, description || null, is_internal, created_at]
      );
    } else {
      result = await db.run(
        'INSERT INTO entries (name, description, is_internal) VALUES (?, ?, ?)',
        [name, description || null, is_internal]
      );
    }
    
    const newEntry = await db.get(
      'SELECT * FROM entries WHERE id = ?',
      [result.lastID]
    );
    
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}