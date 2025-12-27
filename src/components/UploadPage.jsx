import React, { useState } from 'react'
import { Box, Button, LinearProgress, Paper, Typography, Alert } from '@mui/material'
import axios from 'axios'

export default function UploadPage(){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000')

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setErrorMessage(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return setErrorMessage('Select a file first')
    setLoading(true)
    setErrorMessage(null)
    setResult(null)
    const form = new FormData()
    form.append('resume', file)
    try {
      const token = localStorage.getItem('token')
      const headers = {}
      if (token) headers.Authorization = `Bearer ${token}`

      const resp = await axios.post(`${API_URL}/api/resumes/upload`, form, { headers })
      setResult(resp.data)
    } catch (err) {
      console.error('Upload error:', err)
      const serverMsg = err?.response?.data?.message
      const status = err?.response?.status
      setErrorMessage(serverMsg || (status ? `Request failed with status ${status}` : err.message || 'Upload failed'))
    } finally {
      setLoading(false)
    }
  }

  const handlePing = async () => {
    setErrorMessage(null)
    try {
      const resp = await axios.get(API_URL + '/')
      alert(`Backend reachable: ${resp.data?.message || resp.statusText}`)
    } catch (err) {
      console.error('Ping error', err)
      setErrorMessage('Cannot reach backend at ' + API_URL + '. Make sure the server is running and CORS is allowed.')
    }
  }

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">Upload resume (PDF / DOCX)</Typography>
      <input type="file" accept=".pdf,.docx,.doc" onChange={handleChange} />
      <Box mt={2} sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>Upload & Analyze</Button>
        <Button variant="outlined" onClick={handlePing} disabled={loading}>Test backend</Button>
      </Box>
      {loading && <Box mt={2}><LinearProgress /></Box>}

      {errorMessage && (
        <Box mt={2}>
          <Alert severity="error">{errorMessage}</Alert>
        </Box>
      )}

      {result && (
        <Box mt={3}>
          <Typography variant="subtitle1">Analysis Summary</Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.analysis || result, null, 2)}</pre>
        </Box>
      )}
    </Paper>
  )
}
