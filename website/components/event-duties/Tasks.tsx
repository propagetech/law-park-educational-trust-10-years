'use client'

import { useId, useState } from 'react'
import {
  inputClass,
  primaryButtonClass,
  sameName,
  tidy,
  timeAgo,
  type Comment,
  type Member,
  type Post,
  type Todo,
  type TodoStatus,
} from './shared'

// Everyday words for each status, in the order people move through them.
export const STATUS: Record<TodoStatus, { label: string; short: string; className: string }> = {
  todo: { label: 'Not started', short: 'Not started', className: 'bg-muted text-ink-soft ring-line' },
  doing: { label: 'Working on it', short: 'Working', className: 'bg-warn-soft text-warn-ink ring-warn-line' },
  stuck: { label: 'Need help', short: 'Need help', className: 'bg-danger-soft text-danger-ink ring-danger-line' },
  done: { label: 'Done', short: 'Done', className: 'bg-success-soft text-success-ink ring-success-line' },
}
const STATUS_ORDER: TodoStatus[] = ['todo', 'doing', 'stuck', 'done']

export function statusOf(t: Todo): TodoStatus {
  return (t.status in STATUS ? t.status : t.done ? 'done' : 'todo') as TodoStatus
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  )
}

interface TaskRowProps {
  todo: Todo
  comments: Comment[]
  members: Member[]
  me: string
  busy: boolean
  post: Post
  busyKey: string
  // Shown above the task when it is listed away from its activity.
  caption?: string
}

export function TaskRow({ todo, comments, members, me, busy, post, busyKey, caption }: TaskRowProps) {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const panelId = useId()
  const status = statusOf(todo)
  const done = status === 'done'
  const mine = todo.assignee ? sameName(todo.assignee, me) : false

  // The select lists the team, plus whoever the task is with if they are not on it.
  const names = members.map((m) => m.name)
  if (todo.assignee && !names.some((n) => sameName(n, todo.assignee!))) names.push(todo.assignee)
  names.sort((a, b) => a.localeCompare(b))

  const setStatus = (s: TodoStatus) => post({ action: 'setTodoStatus', id: todo.id, status: s }, busyKey)
  const assign = (name: string) => post({ action: 'assignTodo', id: todo.id, assignee: name }, busyKey)

  return (
    <li className="rounded-xl ring-1 ring-line">
      <div className="flex items-start gap-3 p-3">
        {/* One tap to finish a task, or to undo. */}
        <button
          type="button"
          onClick={() => void setStatus(done ? 'todo' : 'done')}
          disabled={busy}
          aria-label={done ? `Mark not done: ${todo.text}` : `Mark done: ${todo.text}`}
          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50 ${
            done ? 'border-success-ink bg-success-ink text-surface' : 'border-line-strong text-transparent hover:border-success-ink hover:text-success-ink'
          }`}
        >
          <CheckIcon />
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
        >
          {caption && <span className="block text-xs font-semibold text-gold-ink">{caption}</span>}
          <span className={`block leading-snug ${done ? 'text-ink-muted line-through' : 'text-ink'}`}>{todo.text}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className={todo.assignee ? 'font-semibold text-ink-soft' : 'italic text-ink-muted'}>
              {todo.assignee ? (mine ? 'You' : todo.assignee) : 'No one yet'}
            </span>
            {status !== 'todo' && status !== 'done' && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${STATUS[status].className}`}>{STATUS[status].label}</span>
            )}
            {comments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-ink-muted">
                <CommentIcon />
                {comments.length}
                <span className="sr-only">{comments.length === 1 ? 'comment' : 'comments'}</span>
              </span>
            )}
          </span>
        </button>
        <span aria-hidden className={`mt-2 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </div>

      {open && (
        <div id={panelId} className="space-y-5 border-t border-line px-3 pb-4 pt-4 sm:px-4">
          <div>
            <label htmlFor={`${panelId}-who`} className="block text-sm font-semibold text-ink">
              Who is doing this?
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <select
                id={`${panelId}-who`}
                value={todo.assignee ?? ''}
                disabled={busy}
                onChange={(e) => void assign(e.target.value)}
                className={`min-h-11 min-w-0 flex-1 bg-surface ${inputClass}`}
              >
                <option value="">No one yet</option>
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {!mine && (
                <button type="button" disabled={busy} onClick={() => void assign(me)} className={`min-h-11 ${primaryButtonClass}`}>
                  I will do it
                </button>
              )}
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-ink">How is it going?</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  aria-pressed={status === s}
                  onClick={() => void setStatus(s)}
                  className={`min-h-11 rounded-lg px-3 text-sm font-semibold ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    status === s ? `${STATUS[s].className} ring-2` : 'bg-surface text-ink-soft ring-line hover:bg-muted'
                  }`}
                >
                  {status === s && <span aria-hidden>✓ </span>}
                  {STATUS[s].label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <h5 className="text-sm font-semibold text-ink">Comments</h5>
            {comments.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="font-semibold text-ink">{sameName(c.by_name, me) ? 'You' : c.by_name}</span>
                    <span className="text-ink-muted"> · {timeAgo(c.at)}</span>
                    <p className="mt-0.5 whitespace-pre-line text-ink-soft">{c.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-ink-muted">No comments yet.</p>
            )}
            <form
              className="mt-2 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault()
                const t = comment.trim()
                if (!t) return
                if (await post({ action: 'addComment', todoId: todo.id, text: t }, busyKey)) setComment('')
              }}
            >
              <label htmlFor={`${panelId}-comment`} className="sr-only">
                Write a comment on {todo.text}
              </label>
              <textarea
                id={`${panelId}-comment`}
                rows={1}
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write an update, like: bought the oil"
                className={`min-h-11 min-w-0 flex-1 resize-y ${inputClass}`}
              />
              <button type="submit" disabled={busy || !comment.trim()} className={`min-h-11 ${primaryButtonClass}`}>
                Send
              </button>
            </form>
          </div>

          {editing ? (
            <form
              className="flex flex-wrap gap-2"
              onSubmit={async (e) => {
                e.preventDefault()
                if (tidy(text).length < 2) return
                if (await post({ action: 'editTodo', id: todo.id, text }, busyKey)) setEditing(false)
              }}
            >
              <label htmlFor={`${panelId}-text`} className="sr-only">
                Task
              </label>
              <input
                id={`${panelId}-text`}
                type="text"
                maxLength={200}
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                className={`min-h-11 min-w-0 flex-1 ${inputClass}`}
              />
              <button type="submit" disabled={busy || tidy(text).length < 2} className={`min-h-11 ${primaryButtonClass}`}>
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="min-h-11 rounded-lg px-4 text-sm font-semibold text-ink-soft hover:bg-muted">
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex flex-wrap gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setText(todo.text)
                  setEditing(true)
                }}
                className="inline-flex min-h-10 items-center rounded-lg px-3 font-semibold text-link hover:bg-muted"
              >
                Change the wording
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete the task "${todo.text}"?`)) void post({ action: 'removeTodo', id: todo.id }, busyKey)
                }}
                className="inline-flex min-h-10 items-center rounded-lg px-3 font-semibold text-ink-muted hover:bg-danger-soft hover:text-danger-ink"
              >
                Delete task
              </button>
              {todo.updated_by && todo.updated_at && (
                <span className="inline-flex min-h-10 items-center text-xs text-ink-muted">
                  Last change by {todo.updated_by}, {timeAgo(todo.updated_at)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  )
}

interface TaskListProps {
  // What the tasks belong to: an activity or a duty.
  parentId: string
  parentTitle: string
  todos: Todo[]
  commentsByTodo: Map<number, Comment[]>
  members: Member[]
  me: string
  busy: boolean
  post: Post
}

// The task list inside an activity or a duty.
export function TaskList({ parentId, parentTitle, todos, commentsByTodo, members, me, busy, post, heading = true }: TaskListProps & { heading?: boolean }) {
  const [draft, setDraft] = useState('')
  const done = todos.filter((t) => statusOf(t) === 'done').length

  return (
    <div className={heading ? 'mt-5' : ''}>
      {heading && (
        <h4 className="text-sm font-semibold text-ink">
          Tasks{' '}
          {todos.length > 0 && (
            <span className="font-normal text-ink-muted">
              ({done} of {todos.length} done)
            </span>
          )}
        </h4>
      )}
      {todos.length > 0 && (
        <ul className="mt-2 space-y-2">
          {todos.map((t) => (
            <TaskRow
              key={t.id}
              todo={t}
              comments={commentsByTodo.get(t.id) ?? []}
              members={members}
              me={me}
              busy={busy}
              post={post}
              busyKey={parentId}
            />
          ))}
        </ul>
      )}
      <form
        className="mt-3 flex gap-2 print:hidden"
        onSubmit={async (e) => {
          e.preventDefault()
          const text = tidy(draft)
          if (text.length < 2) return
          if (await post({ action: 'addTodo', eventId: parentId, text }, parentId)) setDraft('')
        }}
      >
        <label htmlFor={`new-todo-${parentId}`} className="sr-only">
          Add a task to {parentTitle}
        </label>
        <input
          id={`new-todo-${parentId}`}
          type="text"
          maxLength={200}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task"
          className={`min-h-11 min-w-0 flex-1 ${inputClass}`}
        />
        <button type="submit" disabled={busy || tidy(draft).length < 2} className={`min-h-11 ${primaryButtonClass}`}>
          Add
        </button>
      </form>
    </div>
  )
}
