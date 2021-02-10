import { SET_LANGUAGE, LangAction, LangStateI } from "../types"

const localStorageLang = localStorage.getItem("language")

const initialState: LangStateI = {
	language: localStorageLang ? localStorageLang : "en",
}

const langReducer = (state = initialState, action: LangAction) => {
	switch (action.type) {
		case SET_LANGUAGE:
			return {
				...state,
				language: action.payload,
			}

		default:
			return state
	}
}

export default langReducer