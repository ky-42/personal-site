import styled from 'styled-components';
import { Devblog } from '../../types/Content';
import { ReducerAction, SetReducer, UpdateReducer } from '../../types/ManageContent';
import InputArea from './InputArea';
import { ShortTextInput } from './InputElements';
import { Dispatch } from 'react';

/* -------------------------------------------------------------------------- */

const DevblogManagementArea = styled.div``;

/* -------------------------------------------------------------------------- */

interface DevblogManagementProps {
  devblogData: Devblog;
  setDevblogData: Dispatch<SetReducer<Devblog> | UpdateReducer<Devblog, keyof Devblog>>;
  // Possible errors in an input with key being feild and value being error message
  validationErrors: Record<string, string>;
}

// Form for devblog data
const DevblogManagement = ({
  devblogData,
  setDevblogData,
  validationErrors,
}: DevblogManagementProps) => {
  return (
    <DevblogManagementArea>
      <InputArea
        lableText={'Devblog Title'}
        error={validationErrors['title']}
        InputElement={
          <ShortTextInput
            type='text'
            value={devblogData.title}
            onChange={(e) =>
              setDevblogData({
                action: ReducerAction.Update,
                field: 'title',
                value: e.target.value,
              })
            }
          />
        }
      />
    </DevblogManagementArea>
  );
};

export default DevblogManagement;
