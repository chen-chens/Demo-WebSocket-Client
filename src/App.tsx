import { useState } from 'react'
import './App.css'
import { Button } from '@mui/material'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <h1>WebSocket Demo</h1>
      <section className="card">
        <Button variant="contained" color="primary">
          系列一：推播範圍
        </Button>
      </section>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
