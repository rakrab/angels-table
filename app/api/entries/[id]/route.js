import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const entry = await db.get('SELECT * FROM entries WHERE id = ?', [id]);
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, description, is_internal, created_at } = await request.json();
    
    // Validation
    if (name !== undefined && (typeof name !== 'string' || name === '')) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string' },
        { status: 400 }
      );
    }
    
    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      );
    }
    
    if (is_internal !== undefined && is_internal !== 0 && is_internal !== 1) {
      return NextResponse.json(
        { error: 'is_internal must be 0 or 1' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Check if entry exists
    const existing = await db.get('SELECT * FROM entries WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    
    if (is_internal !== undefined) {
      updates.push('is_internal = ?');
      values.push(is_internal);
    }
    
    if (created_at !== undefined) {
      updates.push('created_at = ?');
      values.push(created_at);
    }
    
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }
    
    values.push(id);
    
    await db.run(
      `UPDATE entries SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    const updatedEntry = await db.get('SELECT * FROM entries WHERE id = ?', [id]);
    
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    
    // Check if entry exists
    const existing = await db.get('SELECT * FROM entries WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    await db.run('DELETE FROM entries WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}