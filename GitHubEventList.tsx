import React, { useEffect, useState } from 'react';
import { GitHubEvent } from "../../interfaces/interfaces";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { formatDateTime } from "../../utils/dateUtils";
import axios from 'axios';

const extractUsernameFromUrl = (url: string): string => {
  const segments = url.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
};

const GitHubEventsList = ({ githubUrl }: { githubUrl: string }) => {
    const [githubEvents, setGitHubEvents] = useState<GitHubEvent[]>([]);
    const username = extractUsernameFromUrl(githubUrl);
    const giteveurl = `https://api.github.com/users/${username}`;
  
    useEffect(() => {
      const fetchGitHubEvents = async (): Promise<void> => {
        if (!username) {
          setGitHubEvents([]);
          return;
        }

        try {

          const response = await axios.get(`${giteveurl}/events`);

          const eventsData = response.data as Array<any>;
  
          const filteredEvents = eventsData
            .filter((event: any) => event.type === 'PushEvent')
            .map((event: any) => ({
              id: event.id,
              type: event.type,
              created_at: event.created_at,
              repoUrl: `https://github.com/${event.repo.name}`,
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










