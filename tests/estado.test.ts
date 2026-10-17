import { describe, expect, it } from 'vitest';
import { chapters } from '../src/data/chapters';
import { chapterSolved, initialState, reducer, type GameState } from '../src/state/game';

function solveChapter(s: GameState, id: number): GameState {
  const ch = chapters.find((c) => c.id === id)!;
  return ch.questions
    .filter((q) => q.type !== 'texto')
    .reduce((acc, q) => reducer(acc, { type: 'answer', questionId: q.id, value: q.correct!, correct: true }), s);
}

describe('Progresión', () => {
  it('desbloquear el teléfono abre el capítulo 1', () => {
    const s = reducer(initialState(), { type: 'unlock' });
    expect(s.unlocked).toBe(true);
    expect(s.chapter).toBe(1);
    expect(s.chapterIntro).toBe(1);
    expect(s.clues.c_pin_lucia).toBeTruthy();
  });

  it('un capítulo no avanza con respuestas incorrectas', () => {
    let s = reducer(initialState(), { type: 'unlock' });
    s = reducer(s, { type: 'answer', questionId: 'q1_propietario', value: 'ivan', correct: false });
    expect(s.chapter).toBe(1);
    expect(s.answers.q1_propietario.attempts).toBe(1);
  });

  it('las preguntas abiertas no bloquean el avance', () => {
    let s = reducer(initialState(), { type: 'unlock' });
    s = solveChapter(s, 1);
    expect(s.chapter).toBe(2);
    expect(s.completed).toContain(1);
  });

  it('se puede completar la investigación entera', () => {
    let s = reducer(initialState(), { type: 'unlock' });
    for (const id of [1, 2, 3, 4, 5]) s = solveChapter(s, id);
    expect(s.chapter).toBe(5);
    expect(chapterSolved(s, 5)).toBe(true);
    expect(s.completed).toEqual([1, 2, 3, 4, 5]);
    s = reducer(s, { type: 'finish' });
    expect(s.phase).toBe('final');
    expect(s.finishedAt).toBeTruthy();
  });

  it('el capítulo 1 exige desbloquear el teléfono', () => {
    const s = solveChapter(initialState(), 1);
    expect(s.chapter).toBe(1);
  });

  it('la herramienta de facilitación resuelve el capítulo actual y registra sus pistas', () => {
    let s = reducer(initialState(), { type: 'unlock' });
    s = reducer(s, { type: 'skipChapter' });
    expect(s.chapter).toBe(2);
    expect(s.clues.c_fiesta_cartel).toBeTruthy();
  });

  it('reiniciar conserva los ajustes y borra la partida', () => {
    let s = reducer(initialState(), { type: 'settings', settings: { textScale: 1.3 } });
    s = reducer(s, { type: 'unlock' });
    s = reducer(s, { type: 'reset' });
    expect(s.unlocked).toBe(false);
    expect(s.settings.textScale).toBe(1.3);
    expect(Object.keys(s.clues)).toHaveLength(0);
  });
});

describe('Hipótesis y tablero', () => {
  it('guarda versiones solo cuando cambia el texto', () => {
    let s = reducer(initialState(), { type: 'hypothesisDraft', id: 'h_porque', text: 'Se cansó' });
    s = reducer(s, { type: 'hypothesisSave', id: 'h_porque' });
    s = reducer(s, { type: 'hypothesisSave', id: 'h_porque' });
    expect(s.hypotheses.h_porque.history).toHaveLength(1);
    s = reducer(s, { type: 'hypothesisDraft', id: 'h_porque', text: 'Se fue con su tía' });
    s = reducer(s, { type: 'hypothesisSave', id: 'h_porque' });
    expect(s.hypotheses.h_porque.history.map((v) => v.text)).toEqual(['Se cansó', 'Se fue con su tía']);
  });

  it('no duplica conexiones ni permite unir una tarjeta consigo misma', () => {
    let s = initialState();
    s = reducer(s, { type: 'boardAddNode', node: { id: 'a', kind: 'persona', label: 'Sara', x: 0, y: 0 } });
    s = reducer(s, { type: 'boardAddNode', node: { id: 'b', kind: 'persona', label: 'Nacho', x: 0, y: 0 } });
    s = reducer(s, { type: 'boardAddEdge', edge: { id: 'e1', from: 'a', to: 'b', label: '' } });
    s = reducer(s, { type: 'boardAddEdge', edge: { id: 'e2', from: 'b', to: 'a', label: '' } });
    s = reducer(s, { type: 'boardAddEdge', edge: { id: 'e3', from: 'a', to: 'a', label: '' } });
    expect(s.board.edges).toHaveLength(1);
    s = reducer(s, { type: 'boardRemoveNode', id: 'a' });
    expect(s.board.edges).toHaveLength(0);
  });
});
