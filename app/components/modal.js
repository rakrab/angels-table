import { Modal, Form, Input, Switch, Button, Space, DatePicker } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const { TextArea } = Input;

// Add/Edit Modal Component
export function AddEditModal({ open, entry, onClose, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && entry) {
      form.setFieldsValue({
        name: entry.name,
        description: entry.description,
        is_internal: entry.is_internal === 1,
        created_at: entry.created_at ? dayjs(entry.created_at) : null,
      });
    } else if (open && !entry) {
      form.resetFields();
    }
  }, [open, entry, form]);

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      // Set time to midnight (00:00:00) for the selected date
      created_at: values.created_at ? values.created_at.format('YYYY-MM-DD 00:00:00') : null,
    };
    const success = await onSubmit(formattedValues);
    if (success) {
      form.resetFields();
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={entry ? 'Edit Entry' : 'Add New Entry'}
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          is_internal: false,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Enter name" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea 
            placeholder="Enter description (optional)" 
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="created_at"
          label="Date"
        >
          <DatePicker 
            format="YYYY-MM-DD"
            className="modal-datepicker"
            size="large"
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item
          name="is_internal"
          label="Type"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Uni" 
            unCheckedChildren="Other"
            size="default"
          />
        </Form.Item>

        <Form.Item className="modal-footer">
          <Space className="modal-actions">
            <Button onClick={handleClose} size="large">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              {entry ? 'Update' : 'Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Delete Confirmation Modal Component
export function DeleteModal({ open, entry, onClose, onConfirm }) {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined className="delete-modal-icon" />
          <span>Delete Entry</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      centered
      footer={
        <Space className="modal-actions">
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button danger type="primary" onClick={onConfirm} size="large">
            Delete
          </Button>
        </Space>
      }
    >
      <p className="delete-modal-text">
        Are you sure you want to delete <strong>"{entry?.name}"</strong>?
      </p>
      <p className="delete-modal-warning">
        This action cannot be undone.
      </p>
    </Modal>
  );
}