import { createSlice } from '@reduxjs/toolkit';

export const LanguagesInitialState = {
    languages: [{ name: "English", iso: "us", }, { name: "Español", iso: "es" }, { name: "Français", iso: "fr" }],
    selectedlanguage: { name: "English", iso: "us", }
};
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as resources from "../../../../src/translation/ressources";

export const languagesSlice = createSlice({
    name: 'languages',
    initialState: LanguagesInitialState,
    reducers: {
        setSelectedLanguage: (state, action) => {
            if(state.selectedlanguage.iso !== action.payload.selectedlanguage.iso){
                state.selectedlanguage = action.payload.selectedlanguage
            }
            i18n.use(initReactI18next).init({
                compatibilityJSON: 'v3',
                resources: {
                    ...Object.entries(resources).reduce(
                        (acc, [key, value]) => ({
                            ...acc,
                            [key]: {
                                translation: value,
                            },
                        }),
                        {}
                    ),
                },
                lng: action.payload.selectedlanguage.iso,
            });
        }
    },
});

export const { setSelectedLanguage } = languagesSlice.actions;
