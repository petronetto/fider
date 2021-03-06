import * as React from 'react';
import * as moment from 'moment';
import md5 = require('md5');
import { AxiosError, AxiosResponse } from 'axios';
import { get, getCurrentUser } from '../storage';
import { User, IdeaResponse, IdeaStatus } from '../models';

export const Gravatar = (props: {email?: string}) => {
  const hash = props.email ? md5(props.email) : '';
  return <img className="ui avatar image" src={ 'https://www.gravatar.com/avatar/' + hash } />;
};

export const MultiLineText = (props: {text?: string}) => {
  if (!props.text) {
    return <p></p>;
  }

  return <div>{props.text.split('\n').map((item, i) =>
   <span>{item}<br/></span>
  )}</div>;
};

export const DisplayError = (props: {error?: Error}) => {
  if (!props.error) {
    return <div></div>;
  }

  return <div className="ui negative message">
            <div className="header">
              Oops, an error ocurred...
            </div>
            <p>{ props.error.message }</p>
         </div>;
};

export const EnvironmentInfo = () => {
  const settings = get<any>('settings');
  if (settings.Environment.toLowerCase() !== 'production') {
    return <div className="ui mini negative message no-border no-margin">
                Env: { settings.Environment } |
                Compiler: { settings.Compiler } |
                Version: { settings.Version } |
                BuildTime: { settings.BuildTime }
            </div>;
  }
  return <div/>;
};

export const IdeaStatusRibbon = (props: { status: IdeaStatus }) => {
  return <span className={`ui ribbon label ${props.status.color}`}>{ props.status.title }</span>;
};

interface IdeaResponseProps {
  status: number;
  response: IdeaResponse;
}

export const ShowIdeaResponse = (props: IdeaResponseProps): JSX.Element => {
    const status = IdeaStatus.Get(props.status);

    if (props.response && status.show) {
        return <div className="fdr-response item ui raised segment">
                <IdeaStatusRibbon status={status} />
                <div className="info">
                    <Gravatar email={props.response.user.email}/> <u>{props.response.user.name}</u>
                    <span title={props.response.respondedOn.toString()}>
                    { moment(props.response.respondedOn).fromNow() }
                    </span>
                </div>
                <div className="content">
                    <MultiLineText text={ props.response.text } />
                </div>
                </div>;
    }
    return <div/>;
};
