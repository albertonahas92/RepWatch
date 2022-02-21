import React, { useEffect, useState } from 'react'
import { useNoSleep } from "use-no-sleep";

export const useStayAwak = () => {

    useEffect(() => {
        let _navigator: any;
        _navigator = window.navigator;

        let screenLock: any;
        if (_navigator.wakeLock) {
            _navigator.wakeLock.request("screen").then((lock: any) => {
                screenLock = lock;
            });
        } else {
            useNoSleep(true);
        }

        return () => {
            if (screenLock) {
                screenLock.release();
            }
            {
                useNoSleep(false);
            }
        };
    }, []);


}
