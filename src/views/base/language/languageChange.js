import React from "react";
import { useTranslation } from "react-i18next";
import "./i18n";

const languageChange = () => {
    const { t, i18n } = useTranslation();

    // Change language handler
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{t("btnSubmit")}</h1>
            <p>{t("language")}</p>
            <button onClick={() => changeLanguage("en")}>English</button>
            <button onClick={() => changeLanguage("fr")}>Français</button>
            <button onClick={() => changeLanguage("es")}>Español</button>
        </div>
    );
};

export default languageChange;