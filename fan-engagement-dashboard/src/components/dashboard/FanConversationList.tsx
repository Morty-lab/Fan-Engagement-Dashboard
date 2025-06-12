import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Badge,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import  api  from '../../api/client';

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

const FanConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const getPriorityColor = (priority: number): string => {
    switch(priority) {
      case 1: return '#ff4444'; // High priority - Red
      case 2: return '#ffbb33'; // Medium priority - Yellow
      case 3: return '#00C851'; // Low priority - Green
      default: return '#999';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fan</TableCell>
            <TableCell>Last Message</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Unread</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conversations.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>{row.fanName.charAt(0)}</Avatar>
                  <Typography variant="body1">{row.fanName}</Typography>
                </Box>
              </TableCell>
              <TableCell>{row.lastMessage}</TableCell>
              <TableCell>
                <Badge 
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: getPriorityColor(row.priorityLevel),
                      width: '10px',
                      height: '10px'
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                {row.unreadCount > 0 && (
                  <Badge badgeContent={row.unreadCount} color="secondary" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FanConversationList;