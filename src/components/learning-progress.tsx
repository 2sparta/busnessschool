import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { lessonsFor, type CourseId } from "@/lib/school";

type LearningProgressProps = {
  purchaseId: string;
  courseId: CourseId;
};

export function LearningProgress({ purchaseId, courseId }: LearningProgressProps) {
  const titles = useMemo(() => lessonsFor(courseId), [courseId]);
  const storageKey = `fined-progress-${purchaseId}`;
  const lessonIds = useMemo(() => titles.map((_, index) => `lesson-${index + 1}`), [titles]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompleted(parsed.filter((id): id is string => typeof id === "string" && lessonIds.includes(id)));
        }
      }
    } catch {
      setCompleted([]);
    }
    setHasLoaded(true);
  }, [lessonIds, storageKey]);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {
      // Progress stays usable for the current session if browser storage is unavailable.
    }
  }, [completed, hasLoaded, storageKey]);

  const percentage = titles.length === 0 ? 0 : Math.round((completed.length / titles.length) * 100);

  const toggleLesson = (lessonId: string) => {
    setCompleted((current) =>
      current.includes(lessonId) ? current.filter((item) => item !== lessonId) : [...current, lessonId],
    );
  };

  return (
    <section className="progress-card" aria-labelledby="progress-title">
      <div className="progress-card-heading">
        <div>
          <p className="eyebrow eyebrow-dark">
            <span className="eyebrow-line" /> Твій навчальний маршрут
          </p>
          <h2 id="progress-title">Почни з першого кроку</h2>
        </div>
        <span className="progress-count">
          {completed.length} / {titles.length} <small>завершено</small>
        </span>
      </div>
      <div className="progress-track" aria-label={`Прогрес ${percentage}%`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className="lesson-list">
        {titles.map((lesson, index) => {
          const lessonId = lessonIds[index];
          const isComplete = completed.includes(lessonId);
          return (
            <button
              className={`lesson-row${isComplete ? " is-complete" : ""}`}
              type="button"
              key={lessonId}
              aria-pressed={isComplete}
              onClick={() => toggleLesson(lessonId)}
            >
              <span className="lesson-step">{isComplete ? <Icon name="check" size={16} /> : String(index + 1).padStart(2, "0")}</span>
              <span className="lesson-title">
                {lesson.title}
                <small>{lesson.detail}</small>
              </span>
              <span className="lesson-status">{isComplete ? "Пройдено" : "Позначити"}</span>
            </button>
          );
        })}
      </div>
      <p className="progress-caption" aria-live="polite">
        {percentage === 100
          ? "Маршрут пройдено. Можна повернутися до будь-якої теми."
          : "Натискай на тему після перегляду, щоб зберегти прогрес у цьому браузері."}
      </p>
    </section>
  );
}
