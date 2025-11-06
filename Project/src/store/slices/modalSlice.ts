import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState } from '../../types';

const initialState: ModalState = {
  isAuthModalOpen: false,
  isSearchModalOpen: false,
  isTrailerModalOpen: false,
  trailerUrl: '',
  trailerTitle: '',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    openSearchModal: (state) => {
      state.isSearchModalOpen = true;
    },
    closeSearchModal: (state) => {
      state.isSearchModalOpen = false;
    },
    openTrailerModal: (state, action: PayloadAction<{ url: string; title: string }>) => {
      state.isTrailerModalOpen = true;
      state.trailerUrl = action.payload.url;
      state.trailerTitle = action.payload.title;
    },
    closeTrailerModal: (state) => {
      state.isTrailerModalOpen = false;
      state.trailerUrl = '';
      state.trailerTitle = '';
    },
    closeAllModals: (state) => {
      state.isAuthModalOpen = false;
      state.isSearchModalOpen = false;
      state.isTrailerModalOpen = false;
      state.trailerUrl = '';
      state.trailerTitle = '';
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  openSearchModal,
  closeSearchModal,
  openTrailerModal,
  closeTrailerModal,
  closeAllModals,
} = modalSlice.actions;

export default modalSlice.reducer;
