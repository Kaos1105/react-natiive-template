import { useEffect, useMemo, useState } from "react";
import { formatTime } from "@/hooks/commonHook";
import { useTranslation } from "react-i18next";

const useLockCountdown = () => {
    const { t } = useTranslation();

    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                setCountdown((prevCount) => prevCount - 1);
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
        return () => clearInterval(countdownInterval);
    }, [countdown]);

    const displayLockedMsg = useMemo(() => {
        const time = formatTime(countdown);
        return `${t("common.lockAccount")}  (${time})`;
    }, [countdown]);

    return { countdown, displayLockedMsg, setCountdown };
};

export { useLockCountdown };
