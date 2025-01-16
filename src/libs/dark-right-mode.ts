const LOCALSTRAGE_KEY = 'dark-light-mode';

type mode = 'dark' | 'light';

const checkClient = () => {
    if (typeof window === 'undefined') {
        throw new Error('この関数はブラウザでしか呼ぶことができません');
    }
}

const setDarkMode = () => {
    checkClient();
    localStorage.setItem(LOCALSTRAGE_KEY, 'dark' as mode);
};

const setLightMode = () => {
    checkClient();
    localStorage.setItem(LOCALSTRAGE_KEY, 'light' as mode);
};

const getDarkOrLightMode = () => {
    checkClient();
    const value = localStorage.getItem(LOCALSTRAGE_KEY);
    if (value === 'dark' || value === 'light') {
        return value as mode;
    } else if (value === null) {
        // デフォルトはlight
        localStorage.setItem(LOCALSTRAGE_KEY, 'light' as mode);
        return 'light';
    } else {
        throw new Error('localStrage.getItem("dark-light-mode")に不正値が混入しています');
    }
};


export {
    setDarkMode,
    setLightMode,
    getDarkOrLightMode
};