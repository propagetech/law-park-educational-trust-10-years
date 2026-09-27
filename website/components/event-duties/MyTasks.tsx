'use client'

import { formatTime, sortActivities } from './Schedule'
import { primaryButtonClass, sameName, type Assignment, type Comment, type EventActivity, type Member, type Post, type Todo } from './shared'
import { TaskRow, statusOf } from './Tasks'

interface MyTasksProps {
  events: EventActivity[]
  todos: Todo[]
  comments: Comment[]
  members: Member[]
  byDuty: Map<string, Assignment[]>
  myDuties: string[]
  me: string
  busyKey: string | null
  loaded: boolean
  post: Post
  openSchedule: () => void
  openDuties: () => void
}

function shortDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

// The first screen after sign-in: only what this person needs to do, in the
// order they will do it.
export function MyTasks({ events, todos, comments, members, byDuty, myDuties, me, busyKey, loaded, post, openSchedule, openDuties }: MyTasksProps) {
  const eventsById = new Map(sortActivities(events).map((e, i) => [e.id, { event: e, order: i }]))
  const commentsByTodo = new Map<number, Comment[]>()
  for (const c of comments) {
    const list = commentsByTodo.get(c.todo_id) ?? []
    list.push(c)
    commentsByTodo.set(c.todo_id, list)
  }

  // Tasks on removed activities are hidden everywhere.
  const live = todos
    .filter((t) => eventsById.has(t.event_id))
    .sort((a, b) => eventsById.get(a.event_id)!.order - eventsById.get(b.event_id)!.order || a.id - b.id)
  const caption = (t: Todo) => {
    const e = eventsById.get(t.event_id)!.event
    return `${shortDate(e.date)} · ${formatTime(e.time)} · ${e.title}`
  }

  const mine = live.filter((t) => t.assignee && sameName(t.assignee, me))
  const mineOpen = mine.filter((t) => statusOf(t) !== 'done')
  const mineDone = mine.filter((t) => statusOf(t) === 'done')
  const needHelp = live.filter((t) => statusOf(t) === 'stuck' && !(t.assignee && sameName(t.assignee, me)))
  const leading = new Set(events.filter((e) => byDuty.get(e.id)?.some((p) => sameName(p.person, me))).map((e) => e.id))
  // Open and not already listed under "needs help".
  const unclaimed = live.filter((t) => !t.assignee && statusOf(t) !== 'done' && statusOf(t) !== 'stuck')
  const toHandOut = unclaimed.filter((t) => leading.has(t.event_id))
  const toPickUp = unclaimed.filter((t) => !leading.has(t.event_id)).slice(0, 5)

  const row = (t: Todo) => (
    <TaskRow
      key={t.id}
      todo={t}
      comments={commentsByTodo.get(t.id) ?? []}
      members={members}
      me={me}
      busy={busyKey === `task-${t.id}`}
      post={post}
      busyKey={`task-${t.id}`}
      caption={caption(t)}
    />
  )

  if (!loaded) return <p className="text-ink-soft">Loading your tasks…</p>

  const counts = {
    todo: mine.filter((t) => statusOf(t) === 'todo').length,
    doing: mine.filter((t) => statusOf(t) === 'doing').length,
    stuck: mine.filter((t) => statusOf(t) === 'stuck').length,
    done: mineDone.length,
  }

  return (
    <div className="space-y-10">
      <section aria-labelledby="h-mine">
        <h2 id="h-mine" className="font-serif text-2xl font-bold text-heading">
          Hi {me}
        </h2>
        {mine.length > 0 ? (
          <>
            <p className="mt-1 text-ink-soft">
              You have <strong className="text-ink">{mineOpen.length}</strong> {mineOpen.length === 1 ? 'task' : 'tasks'} to do. Tap
              the circle when one is done, or tap the task to update it.
            </p>
            <p className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-muted px-3 py-1 font-semibold text-ink-soft">{counts.todo} not started</span>
              <span className="rounded-full bg-warn-soft px-3 py-1 font-semibold text-warn-ink">{counts.doing} working on it</span>
              <span className="rounded-full bg-danger-soft px-3 py-1 font-semibold text-danger-ink">{counts.stuck} need help</span>
              <span className="rounded-full bg-success-soft px-3 py-1 font-semibold text-success-ink">{counts.done} done</span>
            </p>
            {mineOpen.length > 0 ? (
              <ul className="mt-5 space-y-2">{mineOpen.map(row)}</ul>
            ) : (
              <p className="mt-5 rounded-xl bg-success-soft p-5 font-semibold text-success-ink">All your tasks are done. Thank you!</p>
            )}
          </>
        ) : (
          <div className="mt-3 rounded-xl bg-surface p-5 ring-1 ring-line">
            <p className="text-ink-soft">
              Nothing has been given to you yet. Pick a task below, or open the Schedule to see everything.
            </p>
            <button type="button" onClick={openSchedule} className={`mt-4 min-h-11 ${primaryButtonClass}`}>
              Open the Schedule
            </button>
          </div>
        )}
      </section>

      {needHelp.length > 0 && (
        <section aria-labelledby="h-help">
          <h2 id="h-help" className="text-lg font-semibold text-danger-ink">
            Someone needs help ({needHelp.length})
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Can you help? Tap a task to read the comments or to take it over.</p>
          <ul className="mt-3 space-y-2">{needHelp.map(row)}</ul>
        </section>
      )}

      {toHandOut.length > 0 && (
        <section aria-labelledby="h-handout">
          <h2 id="h-handout" className="text-lg font-semibold text-ink">
            Tasks on your activities that no one has yet ({toHandOut.length})
          </h2>
          <p className="mt-1 text-sm text-ink-soft">You are in charge of these activities. Tap a task and choose who is doing it.</p>
          <ul className="mt-3 space-y-2">{toHandOut.map(row)}</ul>
        </section>
      )}

      {toPickUp.length > 0 && (
        <section aria-labelledby="h-pickup">
          <h2 id="h-pickup" className="text-lg font-semibold text-ink">
            Tasks you could pick up
          </h2>
          <p className="mt-1 text-sm text-ink-soft">These still need someone. Tap one and choose &ldquo;I will do it&rdquo;.</p>
          <ul className="mt-3 space-y-2">{toPickUp.map(row)}</ul>
          <button type="button" onClick={openSchedule} className="mt-3 inline-flex min-h-11 items-center font-semibold text-link hover:underline">
            See all tasks in the Schedule
          </button>
        </section>
      )}

      <section aria-labelledby="h-myduties">
        <h2 id="h-myduties" className="text-lg font-semibold text-ink">
          Your duties
        </h2>
        {myDuties.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {myDuties.map((d) => (
              <li key={d} className="rounded-full bg-mine px-3 py-1.5 text-sm font-semibold text-mine-ink">
                {d}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-ink-soft">You are not on any duty yet.</p>
        )}
        <button type="button" onClick={openDuties} className="mt-2 inline-flex min-h-11 items-center font-semibold text-link hover:underline">
          {myDuties.length ? 'See all duties' : 'Pick a duty'}
        </button>
      </section>

      {mineDone.length > 0 && (
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-ink-soft [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="transition-transform group-open:rotate-90">▸</span>
            Done ({mineDone.length})
          </summary>
          <ul className="mt-2 space-y-2">{mineDone.map(row)}</ul>
        </details>
      )}
    </div>
  )
}
