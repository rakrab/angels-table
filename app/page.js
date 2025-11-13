'use client';

import { useEffect, useState } from 'react';
import { Button, Spin, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import Confetti from 'react-confetti';
import DayContainer from './components/dayContainer';
import { AddEditModal, DeleteModal } from './components/modal';

export default function Home() {
  const { message } = App.useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [randomCreature, setRandomCreature] = useState('');
  const [runConfetti, setRunConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // List of creature images
  const creatureImages = [
    '/creatures/1.jpg',
    '/creatures/2.jpg',
    '/creatures/3.jpg',
    '/creatures/4.jpg',
    '/creatures/5.jpg',
    '/creatures/6.jpg',
    '/creatures/7.jpg',
    '/creatures/8.jpg',
    '/creatures/9.jpg',
    '/creatures/10.jpg',
    '/creatures/11.jpg',
    '/creatures/12.jpg',
    '/creatures/13.jpg',
    '/creatures/14.jpg',
    '/creatures/15.jpg',
    '/creatures/16.jpg',
    '/creatures/17.jpg',
    '/creatures/18.jpg',
    '/creatures/19.jpg',
    '/creatures/20.jpg',
    '/creatures/21.jpg',
    '/creatures/22.jpg',
    '/creatures/23.jpg',
    '/creatures/24.jpg',
    '/creatures/25.jpg',
    '/creatures/26.jpg',
    '/creatures/27.jpg',
    '/creatures/28.jpg',
    '/creatures/29.jpg',
    '/creatures/30.jpg',
    '/creatures/31.jpg',
    '/creatures/32.jpg',
    '/creatures/33.jpg',
    '/creatures/34.jpg',
    '/creatures/35.jpg',
    '/creatures/36.jpg',
    '/creatures/37.jpg',
    '/creatures/38.jpg',
    '/creatures/39.jpg',
    '/creatures/40.jpg',
    '/creatures/41.jpg',
    '/creatures/42.jpg',
  ];

  // Select a random creature on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * creatureImages.length);
    setRandomCreature(creatureImages[randomIndex]);
  }, []);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch entries from API
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/entries');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      message.error('Failed to fetch entries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Group entries by date
  const groupEntriesByDate = (entries) => {
    const grouped = {};
    
    entries.forEach((entry) => {
      // Parse the date in UTC to avoid timezone issues
      const date = new Date(entry.created_at + 'Z');
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });

    // Sort entries within each day by time (newest first)
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });

    return grouped;
  };

  // Determine if a date should be open by default
  const shouldBeOpenByDefault = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Open if today, yesterday, or future date
    return date >= yesterday;
  };

  // Handle create/update
  const handleSubmit = async (values) => {
    try {
      const url = editingEntry 
        ? `/api/entries/${editingEntry.id}` 
        : '/api/entries';
      
      const method = editingEntry ? 'PUT' : 'POST';
      const isCreating = !editingEntry;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          is_internal: values.is_internal ? 1 : 0,
          created_at: values.created_at,
        }),
      });

      if (response.ok) {
        message.success(editingEntry ? 'Entry updated successfully' : 'Success! Congrats!');
        
        // Trigger confetti only when creating a new entry
        if (isCreating) {
          setRunConfetti(true);
        }
        
        setIsAddEditModalOpen(false);
        setEditingEntry(null);
        fetchEntries();
        return true;
      } else {
        const error = await response.json();
        message.error(error.error || 'Operation failed');
        return false;
      }
    } catch (error) {
      message.error('An error occurred');
      console.error(error);
      return false;
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deletingEntry) return;

    try {
      const response = await fetch(`/api/entries/${deletingEntry.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Entry deleted successfully');
        setIsDeleteModalOpen(false);
        setDeletingEntry(null);
        fetchEntries();
      } else {
        const error = await response.json();
        message.error(error.error || 'Delete failed');
      }
    } catch (error) {
      message.error('An error occurred');
      console.error(error);
    }
  };

  // Open delete modal
  const handleDelete = (entry) => {
    setDeletingEntry(entry);
    setIsDeleteModalOpen(true);
  };

  // Handle edit
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsAddEditModalOpen(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditingEntry(null);
    setIsAddEditModalOpen(true);
  };

  const groupedEntries = groupEntriesByDate(entries);
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b) - new Date(a));

  return (
    <>
      {runConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.25}
            initialVelocityY={15}
            colors={['#4a9008', '#5ab80b', '#6acd0c', '#3a7006', '#2a5004']}
            confettiSource={{
              x: 0,
              y: 0,
              w: windowSize.width,
              h: 0
            }}
            onConfettiComplete={(confetti) => {
              setRunConfetti(false);
              confetti?.reset();
            }}
          />
        </div>
      )}
      
      <div className="entries-container">
        <div className="entries-header">
          <div className="header-branding">
            <div className="header-image-container">
              <img 
                src={randomCreature}
                alt="Header creature"
                className="header-image"
              />
            </div>
            <span className="entries-title">hi</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : sortedDates.length > 0 ? (
          <div className="days-list">
            {sortedDates.map((date) => (
              <DayContainer
                key={date}
                date={date}
                entries={groupedEntries[date]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                defaultOpen={shouldBeOpenByDefault(date)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No entries yet
          </div>
        )}

        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
          className="floating-add-button"
        >
          Add Entry
        </Button>

        <AddEditModal
          open={isAddEditModalOpen}
          entry={editingEntry}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setEditingEntry(null);
          }}
          onSubmit={handleSubmit}
        />

        <DeleteModal
          open={isDeleteModalOpen}
          entry={deletingEntry}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingEntry(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </>
  );
}