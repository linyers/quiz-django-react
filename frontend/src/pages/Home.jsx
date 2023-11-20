import React from 'react'

export default function Home() {
  const names = ['Aruko', 'Arix', 'Ariel']
  const random = Math.round(Math.random() * (names.length - 1))
  return (
    <>
      <h1>Hola {names[random]}</h1>
      <p>Que hacemos?</p>
      <button>Examenes</button><button>Alumnos</button>
    </>
  )
}
