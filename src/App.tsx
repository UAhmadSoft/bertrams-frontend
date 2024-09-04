import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('gb'); // Default country
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://82.197.94.14:3011/api/jobs?keyword=${keyword}&country=${country}&page=${page}&per_page=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.results); // Adjust this depending on your backend response structure
      setTotalPages(Math.ceil(data.count / 20)); // Adjust based on backend response for total pages
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log('event', event)
    setPage(value);
    handleSearch(value);
  };

  const handleDownload = () => {
    const htmlContent = `
      <html>
        <head>
          <title>Job Search Results</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            .job-item { margin-bottom: 20px; }
            .job-title { font-size: 18px; font-weight: bold; }
            .job-description { margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>Job Search Results</h1>
          <div>${jobs.map(job => `
            <div class="job-item">
              <a href="${job.redirect_url}" target="_blank">
                <div class="job-title">${job.title}</div>
                <div class="job-description">${job.description}</div>
              </a>
            </div>
          `).join('')}</div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'job_search_results.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const countryOptions = [
    { code: 'gb', label: 'Great Britain' },
    { code: 'us', label: 'United States' },
    { code: 'at', label: 'Austria' },
    { code: 'au', label: 'Australia' },
    { code: 'be', label: 'Belgium' },
    { code: 'br', label: 'Brazil' },
    { code: 'ca', label: 'Canada' },
    { code: 'ch', label: 'Switzerland' },
    { code: 'de', label: 'Germany' },
    { code: 'es', label: 'Spain' },
    { code: 'fr', label: 'France' },
    { code: 'in', label: 'India' },
    { code: 'it', label: 'Italy' },
    { code: 'mx', label: 'Mexico' },
    { code: 'nl', label: 'Netherlands' },
    { code: 'nz', label: 'New Zealand' },
    { code: 'pl', label: 'Poland' },
    { code: 'sg', label: 'Singapore' },
    { code: 'za', label: 'South Africa' },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Search
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <TextField
            label="Keyword"
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              value={country}
              onChange={(e) => setCountry(e.target.value as string)}
              label="Country"
            >
              {countryOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSearch(1)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownload}
            disabled={loading || jobs.length === 0}
            sx={{ ml: 2 }}
          >
            Download HTML
          </Button>
        </Box>

        {jobs.length > 0 && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Job Results
            </Typography>
            <List>
              {jobs.map((job, index) => (
                <ListItem
                  key={index}
                  component="a"
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <WorkOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary={job.title} secondary={job.description} />
                </ListItem>
              ))}
            </List>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 4 }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
