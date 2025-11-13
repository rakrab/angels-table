import { Card, Tag, Space, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function EntryCard({ entry, onEdit, onDelete }) {
  // Format date to show only the date part (e.g., "11/12/2025" or "12 Nov 2025")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Uses browser's locale for date format
  };

  return (
    <Card className="entry-card">
      <div className="entry-content">
        <div className="entry-header">
          <h3 className="entry-name">
            {entry.name}
          </h3>
          {entry.is_internal === 1 && <Tag color="green" className="entry-tag">Uni</Tag>}
        </div>
        <div className="entry-date">
          {formatDate(entry.created_at)}
        </div>
        <div className="entry-description">
          {entry.description || ''}
        </div>
      </div>

      <Space className="entry-actions" size="small">
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={() => onEdit(entry)}
          block
          className="entry-button"
        >
          Edit
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(entry)}
          block
          className="entry-button"
        >
          Delete
        </Button>
      </Space>
    </Card>
  );
}