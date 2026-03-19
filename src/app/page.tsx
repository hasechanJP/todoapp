"use client";

import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            ToDoリスト
          </h1>
          {mounted && todos.length > 0 && (
            <p className="text-slate-400 text-sm mt-1">
              残り{" "}
              <span className="font-semibold text-slate-600">{remaining}</span>{" "}
              件
            </p>
          )}
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent shadow-sm transition"
          />
          <button
            onClick={addTodo}
            className="px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 active:scale-95 transition shadow-sm disabled:opacity-40"
            disabled={!input.trim()}
          >
            追加
          </button>
        </div>

        {/* タスクリスト */}
        {mounted && (
          <ul className="space-y-2">
            {todos.length === 0 && (
              <li className="text-center text-slate-400 text-sm py-12">
                タスクがありません
              </li>
            )}
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 group transition hover:border-slate-200"
              >
                {/* チェックボックス */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                    todo.done
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  aria-label={todo.done ? "未完了に戻す" : "完了にする"}
                >
                  {todo.done && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* テキスト */}
                <span
                  className={`flex-1 text-sm leading-snug transition ${
                    todo.done
                      ? "text-slate-400 line-through"
                      : "text-slate-700"
                  }`}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition"
                  aria-label="削除"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 完了済みクリア */}
        {mounted && todos.some((t) => t.done) && (
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
            className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 py-2 transition"
          >
            完了済みをすべて削除
          </button>
        )}
      </div>
    </div>
  );
}
