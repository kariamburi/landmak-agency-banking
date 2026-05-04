"use client";

import { useEffect } from "react";

export default function IdleLogout({ minutes = 15 }: { minutes?: number }) {
    useEffect(() => {
        let timer: any;

        const logout = () => {
            window.location.href = "/logout?reason=idle";
        };

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(logout, minutes * 60 * 1000);
        };

        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

        events.forEach((event) => window.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            clearTimeout(timer);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [minutes]);

    return null;
}