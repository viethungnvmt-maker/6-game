import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock audio because AudioContext isn't available in JSDOM
vi.mock('../utils/audio', () => ({
  playTone: vi.fn(),
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
}))

describe('App', () => {
  it('renders home screen by default', () => {
    render(<App />)
    expect(screen.getByText(/GÓC GAME LỚP HỌC/i)).toBeDefined()
  })

  it('renders game cards', () => {
    render(<App />)
    expect(screen.getByText(/Ai là Triệu phú/i)).toBeDefined()
    expect(screen.getByText(/Vượt chướng ngại vật/i)).toBeDefined()
  })
})
