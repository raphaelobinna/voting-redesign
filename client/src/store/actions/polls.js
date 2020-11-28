import api from '../../services/api';
import {SET_POLLS, SET_CURRENT_POLL} from '../actionTypes';
import { addError, removeError } from './error';

export const setPolls = polls => ({
    type: SET_POLLS,
    polls
});

export const setCurrentPoll = poll => ({
    type: SET_CURRENT_POLL,
    poll
});

export const getPolls = () => {
    return async dispatch => {
        try {
            const polls = await api.call('get', 'poll')
            if(polls){
            dispatch(setPolls(polls));
            dispatch(removeError())
            }else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
};

export const getHeroes = () => {
    return async dispatch => {
        try {
        
            const poll = await api.call('get', 'admin')
           
            if(poll){
            dispatch(setCurrentPoll(poll));
            dispatch(removeError())
            }else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
};



export const getUserPolls = () => {
    return async dispatch => {
        try {
            const polls = await api.call('get', 'poll/user');
            if(polls){
            dispatch(setPolls(polls));
            dispatch(removeError());
            } else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
};

export const createPoll = data => {
    return async dispatch => {
        try {
            const poll = await api.call('post', 'admin', data);
            dispatch(setCurrentPoll(poll));
            dispatch(removeError())
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
};

export const getCurrentPoll = path => {
    return async dispatch => {
        try {
            const poll = await api.call('get', `poll/${path}`)
            if(poll){
            dispatch(setCurrentPoll(poll));
            dispatch(removeError());
            }else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
};

export const vote = (path, data) => {
    return async dispatch => {
        try {
            const poll = await api.call('post', `poll/${path}`, data);
            if(poll){
                console.log( poll)
                dispatch(userVotes(path))
            dispatch(setCurrentPoll(poll));
            dispatch(removeError());
            }else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
}

export const userVotes = (path) => {
    return async dispatch => {
        try {
            const poll = await api.call('get', `poll/votes/${path}`);
            if(poll){
                console.log( poll)
            dispatch(setCurrentPoll(poll));
            dispatch(removeError());
            }else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
}

export const deletePoll = (path) => {
    return async dispatch => {
        try {
            const poll = await api.call('delete', `poll/${path}`);
            if(poll){
                console.log('delete is', poll)
            dispatch(setCurrentPoll(poll));
            dispatch(removeError());
            }else {
                alert('something went wrong')
            }
        } catch (err) {
            const error = err.response.data;
            dispatch(addError(error.message));
        }
    }
    
}