import { Collapse } from 'antd';
import EntryCard from './card';

export default function DayContainer({ date, entries, onEdit, onDelete, defaultOpen }) {
  // Format the date as a readable header (e.g., "Today", "Yesterday", "Nov 12, 2025")
  const getDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for accurate comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "Day Month Year" (e.g., "12 November 2025")
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const items = [
    {
      key: date,
      label: (
        <span className="day-container-label">
          {getDateHeader(date)}
        </span>
      ),
      children: (
        <div>
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <Collapse
      items={items}
      defaultActiveKey={defaultOpen ? [date] : []}
      ghost
      className="day-container"
      expandIconPosition="end"
    />
  );
}