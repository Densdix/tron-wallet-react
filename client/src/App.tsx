import React, { useEffect, useState } from 'react';
import './App.css';
import FooterNavBar from './components/FooterNavBar/FooterNavBar';
import { Navigate, Outlet, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import useLocalStorage from 'use-local-storage'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from './redux/store';
import Preloader from './components/common/Preloader/Preloader';
import { userIsAuthThunk } from './redux/reducers/accountSlice';

const App = () => {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  const isLogged = useSelector((state: RootState) => state.account.isAuth)
  const isLoading = useAppSelector(state => state.account.isLoading)

  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();


  // console.log(theme)

  const dispatch = useAppDispatch()

  useEffect(() => {
  let cod = searchParams.get('cod')
  // console.log(isLogged)

  if(cod && !isLogged){
    navigate('/login', {state: cod})
    // console.log(searchParams.get('cod'))
  }else{
    dispatch(userIsAuthThunk())
  }
    
  }, [])

  return (
    <>
      {isLogged
        ? <div className="App" data-theme={theme}>
          <div className='App-content'>
            <Outlet context={[theme, setTheme]}/>
          </div>
          <FooterNavBar />
          {isLoading && <Preloader />}
        </div>
        : <Navigate to="/login" />}
    </>

  );
}

export default App;
