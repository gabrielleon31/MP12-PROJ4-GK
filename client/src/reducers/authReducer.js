const authReducer = (
    state = {
        authData: null,
        loading: false,
        error: false,
        updateLoading: false,
        // --- AÑADIR ESTADO PARA BÚSQUEDA DE USUARIOS ---
        userSearchResults: [], // Array para almacenar los resultados de la búsqueda de usuarios
        userSearchLoading: false, // Indicador de carga para la búsqueda de usuarios
        userSearchError: false, // Indicador de error para la búsqueda de usuarios
        // --- FIN ESTADO BÚSQUEDA DE USUARIOS ---
    },
    action
) => {
    switch (action.type) {
        case "AUTH_START":
            return { ...state, loading: true, error: false };
        case "AUTH_SUCCESS":
            // Asegurarse de que authData.user y authData.token existen antes de guardar
            if (action.data && action.data.user && action.data.token) {
                localStorage.setItem("profile", JSON.stringify({ ...action.data }));
                 // Clonar profundamente authData para evitar mutación directa del estado nested
                return { ...state, authData: JSON.parse(JSON.stringify(action.data)), loading: false, error: false };
            } else {
                 // Manejar caso de respuesta inesperada
                console.error("AUTH_SUCCESS: Unexpected payload structure", action.data);
                return { ...state, loading: false, error: true }; // O manejar de otra forma
            }


        case "AUTH_FAIL":
            return { ...state, loading: false, error: true };



        case "UPDATING_START":
            return { ...state, updateLoading: true, error: false };
        case "UPDATING_SUCCESS":
            // Asegurarse de que action.data existe antes de guardar en localStorage
            if (action.data) {
               localStorage.setItem("profile", JSON.stringify({ ...action.data }));
               // Clonar profundamente action.data.user para evitar mutación
               return { ...state, authData: { ...state.authData, user: JSON.parse(JSON.stringify(action.data.user)) }, updateLoading: false, error: false };
            } else {
                 console.error("UPDATING_SUCCESS: Unexpected payload structure", action.data);
                 return { ...state, updateLoading: false, error: true };
            }

        case "UPDATING_FAIL":
            return { ...state, updateLoading: false, error: true };



        case "FOLLOW_USER":
             // Asegurarse de que user y following existen
            if (state.authData && state.authData.user && Array.isArray(state.authData.user.following)) {
                 return {
                     ...state,
                     authData: {
                         ...state.authData,
                         user: {
                             ...state.authData.user,
                             following: [...state.authData.user.following, action.data],
                         },
                     },
                 };
            }
             console.warn("FOLLOW_USER: authData or following array missing/invalid", state.authData);
             return state;


        case "UNFOLLOW_USER":
             // Asegurarse de que user y following existen
            if (state.authData && state.authData.user && Array.isArray(state.authData.user.following)) {
                 return {
                     ...state,
                     authData: {
                         ...state.authData,
                         user: {
                             ...state.authData.user,
                             following: state.authData.user.following.filter((personId) => personId !== action.data),
                         },
                     },
                 };
            }
             console.warn("UNFOLLOW_USER: authData or following array missing/invalid", state.authData);
             return state;


        case "LOG_OUT":
            localStorage.clear();
            return { authData: null, loading: false, error: false, updateLoading: false, userSearchResults: [], userSearchLoading: false, userSearchError: false }; // Limpiar también resultados de búsqueda al salir

        // --- AÑADIR CASOS PARA BÚSQUEDA DE USUARIOS ---
        case 'USER_SEARCH_START': // Basado en UserAction.js
            return {
                ...state,
                userSearchLoading: true,
                userSearchError: false,
                userSearchResults: [], // Limpiar resultados anteriores al iniciar una nueva búsqueda
            };

        case 'USER_SEARCH_SUCCESS': // Basado en UserAction.js
             // Asegurarse de que action.data es un array o manejarlo
            if (Array.isArray(action.data)) {
                return {
                    ...state,
                    userSearchLoading: false,
                    userSearchError: false,
                    userSearchResults: action.data, // Guardar los resultados recibidos del backend
                };
            } else {
                 console.error("USER_SEARCH_SUCCESS: Expected array payload, received", action.data);
                 return { ...state, userSearchLoading: false, userSearchError: true, userSearchResults: [] }; // Manejar caso inesperado
            }


        case 'USER_SEARCH_FAIL': // Basado en UserAction.js
            return {
                ...state,
                userSearchLoading: false,
                userSearchError: true,
                userSearchResults: [], // Limpiar o dejar vacíos los resultados en caso de error
            };
        // --- FIN CASOS BÚSQUEDA DE USUARIOS ---


        default:
            return state;
    }
};

export default authReducer;