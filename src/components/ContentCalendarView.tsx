import React, { useState } from 'react';
import { Post, SocialPlatform } from '../types';
import { PlatformIcon, PLATFORM_CONFIG } from './PlatformBadge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ContentCalendarViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onNewPostAtDate: (dateIso: string) => void;
}

export function ContentCalendarView({ posts, onSelectPost, onNewPostAtDate }: ContentCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate grid days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    isCurrentMonth: false,
    date: new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
  }));

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    date: new Date(year, month, i + 1),
  }));

  const totalDisplayed = prevMonthDays.length + currentMonthDays.length;
  const remainingSlots = (7 - (totalDisplayed % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingSlots }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
    date: new Date(year, month + 1, i + 1),
  }));

  const allCalendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Find posts scheduled for specific calendar day
  const getPostsForDay = (date: Date) => {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const endOfDay = startOfDay + 86400000;

    return posts.filter((p) => {
      const pTime = new Date(p.scheduledAt).getTime();
      return pTime >= startOfDay && pTime < endOfDay;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
      
      {/* Calendar Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Postiz Social Dispatcher Matrix</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            Today
          </button>
          
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-1">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {allCalendarDays.map((cell, idx) => {
          const dayPosts = getPostsForDay(cell.date);
          const cellIsToday = isToday(cell.date);

          return (
            <div
              key={idx}
              className={`min-h-[105px] sm:min-h-[130px] rounded-2xl p-2 border transition-all flex flex-col justify-between group ${
                cellIsToday
                  ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                  : cell.isCurrentMonth
                  ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-950/20 border-slate-900/60 opacity-40'
              }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                    cellIsToday
                      ? 'bg-indigo-600 text-white font-bold'
                      : cell.isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {cell.day}
                </span>

                {cell.isCurrentMonth && (
                  <button
                    onClick={() => {
                      const d = new Date(cell.date);
                      d.setHours(12, 0, 0, 0);
                      onNewPostAtDate(d.toISOString().slice(0, 16));
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-opacity"
                    title="Plan post on this day"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Day Posts List */}
              <div className="space-y-1.5 my-1 flex-1 overflow-y-auto max-h-[80px] scrollbar-none">
                {dayPosts.map((post) => {
                  const statusColors = {
                    published: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60',
                    scheduled: 'bg-indigo-950/60 text-indigo-300 border-indigo-700/60',
                    draft: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
                    failed: 'bg-red-950/60 text-red-300 border-red-700/60',
                    queued: 'bg-amber-950/60 text-amber-300 border-amber-700/60',
                  };

                  return (
                    <div
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className={`cursor-pointer p-1.5 rounded-lg border text-[11px] leading-tight transition-all hover:scale-[1.02] shadow-sm flex flex-col gap-1 ${
                        statusColors[post.status]
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {post.platforms.slice(0, 3).map((plat) => (
                            <PlatformIcon key={plat} platform={plat} className="w-2.5 h-2.5" />
                          ))}
                          {post.platforms.length > 3 && (
                            <span className="text-[9px]">+{post.platforms.length - 3}</span>
                          )}
                        </div>

                        <span className="text-[9px] font-mono opacity-80">
                          {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="truncate font-medium text-slate-200">
                        {post.content || 'Untitled post'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Day foot indicator */}
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>{dayPosts.length > 0 ? `${dayPosts.length} post${dayPosts.length > 1 ? 's' : ''}` : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
