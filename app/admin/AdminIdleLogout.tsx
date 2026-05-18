"use client";

import { useEffect, useRef } from "react";

export default function AdminIdleLogout({
    timeoutMinutes,
}: {
    timeoutMinutes: number;
}) {
    const timerRef = useRef<any>(null);

    useEffect(() => {
        const timeoutMs = Math.max(Number(timeoutMinutes || 15), 1) * 60 * 1000;

        function logout() {
            window.location.href = "/logout";
        }

        function resetTimer() {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(logout, timeoutMs);
        }

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "click",
        ];

        events.forEach((event) =>
            window.addEventListener(event, resetTimer, { passive: true })
        );

        resetTimer();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [timeoutMinutes]);

    return null;
}