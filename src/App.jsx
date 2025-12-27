import React from 'react'
import { Container, Typography } from '@mui/material'
import UploadPage from './components/UploadPage'

export default function App(){
  return (
    <Container maxWidth="md" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>AI-Powered Resume Analyzer</Typography>
      <UploadPage />
    </Container>
  )
}
