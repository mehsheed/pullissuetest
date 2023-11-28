import React from 'react';
import { Post, Author,GitHubEvent } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, CardMedia, Link, 
    Grid, Button, IconButton, CardActionArea, ButtonBase } from "@mui/material";
import { formatDateTime } from "../../utils/dateUtils";
import { getAuthorId } from "../../utils/localStorageUtils";
import { renderVisibility }from '../../utils/postUtils';
import { MuiMarkdown } from 'mui-markdown';
import PostCategories from "./PostCategories";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MakeCommentModal from "./MakeCommentModal";
import ShareIcon from '@mui/icons-material/Share';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SharePostModal from './SharePostModal';
import { getUserCredentials } from '../../utils/localStorageUtils';


import MoreMenu from './edit/MoreMenu';
import styled from '@emotion/styled';
import PostLikes from "./like/PostLikes";

const APP_URI = process.env.REACT_APP_URI;

const extractUsernameFromUrl = (url: string): string => {
  // Split the URL by '/' and get the last segment
  const segments = url.split('/');
  return segments[segments.length - 1];
};

const GitHubEventsList = ({ githubUrl }: { githubUrl: string }) => {
    const [githubEvents, setGitHubEvents] = useState<GitHubEvent[]>([]);
    const username = extractUsernameFromUrl(githubUrl);
    const giteveurl = `https://api.github.com/users/${username}`;
  
    useEffect(() => {
      const fetchGitHubEvents = async (): Promise<void> => {
        try {

          const response = await axios.get(`${giteveurl}/events`);

          const eventsData = response.data as Array<any>;
  
          const filteredEvents = eventsData
            .filter((event: any) => event.type === 'PushEvent')
            .map((event: any) => ({
              id: event.id,
              type: event.type,
              created_at: event.created_at,
              repoUrl: event.repo.name,
            }));
  
          setGitHubEvents(filteredEvents);
        } catch (error) {
          console.error('Error fetching GitHub events:', error);
          setGitHubEvents([]);
        }
      };
  
      fetchGitHubEvents();
    }, [githubUrl]);
        
    return (
        <Grid container spacing={2}>
          {githubEvents.length > 0 ? (
            githubEvents.map((event) => (
              <Grid item key={event.id} xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{event.type}</Typography>
                    <Typography>
                      <strong>Event ID:</strong> {event.id}
                    </Typography>
                    <Typography>
                      <strong>Created at:</strong> {formatDateTime(event.created_at)}
                    </Typography>
                    <Typography>
                      <strong>Repository URL:</strong>{' '}
                      <a href={event.repoUrl} target="_blank" rel="noopener noreferrer">
                        {event.repoUrl}
                      </a>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center">
              No GitHub events available...
            </Typography>
          )}
        </Grid>
      );
    };
    
    export default GitHubEventsList;












