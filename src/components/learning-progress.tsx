"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import type { CourseId } from "@/lib/school";

const lessonTitles: Record<CourseId, readonly string[]> = {
  entrepreneurship: [
    "Визнач свою точку А та ціль",
    "Перевір ідею: проблема, клієнт, попит",
    "Сформуй першу ціннісну пропозицію",
    "Побудуй просту фінансову модель",
    "Запусти тест продажів і збери фідбек",
    "Сплануй наступні 90 днів зростання",
  ],
  leadership: [
    "Твій стиль лідерства та зона впливу",
    "Комунікація, яка дає ясність команді",
    "Делегування без мікроменеджменту",
    "Мотивація та відповідальність людей",
    "Непрості розмови й конструктивний фідбек",
    "План розвитку команди на 90 днів",
  ],
  marketing: [
    "Портрет клієнта та його справжні потреби",
    "Позиціонування: чим ти відрізняєшся",
    "Маркетингова воронка без зайвих кроків",
    "Контент і канали, які приводять клієнтів",
    "Продажі: діалог, довіра, наступний крок",
    "Метрики, які варто перевіряти щотижня",
  ],
  finance: [
    "Фінансова карта бізнесу або особистих цілей",
    "Грошовий потік, прибуток і точка беззбитковості",
    "Резерв, ризики та фінансова дисципліна",
    "Як читати інвестиційні інструменти",
    "Диверсифікація та горизонт інвестування",
    "Твій індивідуальний план капіталу",
  ],
};

type LearningProgressProps = {
  purchaseId: string;
  courseId: CourseId;
};

export function LearningProgress({ purchaseId, courseId }: LearningProgressProps) {
  const titles = lessonTitles[courseId];
  const storageKey = `empire-progress-${purchaseId}`;
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

  const percentage = Math.round((completed.length / titles.length) * 100);

  const toggleLesson = (lessonId: string) => {
    setCompleted((current) =>
      current.includes(lessonId) ? current.filter((item) => item !== lessonId) : [...current, lessonId],
    );
  };

  return (
    <section className="progress-card" aria-labelledby="progress-title">
      <div className="progress-card-heading">
        <div>
          <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Твій навчальний маршрут</p>
          <h2 id="progress-title">Почни з першого кроку</h2>
        </div>
        <span className="progress-count">{completed.length} / {titles.length} <small>завершено</small></span>
      </div>
      <div className="progress-track" aria-label={`Прогрес ${percentage}%`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className="lesson-list">
        {titles.map((title, index) => {
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
              <span className="lesson-step">{isComplete ? <Icon name="check" size={16} /> : `0${index + 1}`}</span>
              <span className="lesson-title">{title}<small>Практичний модуль · {18 + index * 3} хв</small></span>
              <span className="lesson-status">{isComplete ? "Пройдено" : "Позначити"}</span>
            </button>
          );
        })}
      </div>
      <p className="progress-caption" aria-live="polite">
        {percentage === 100 ? "Чудова робота — маршрут завершено. Обери наступну ціль!" : "Натискай на модуль після перегляду, щоб зберегти свій прогрес."}
      </p>
    </section>
  );
}
