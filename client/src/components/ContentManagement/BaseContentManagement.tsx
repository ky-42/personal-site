import { useState } from 'react';
import styled from 'styled-components';
import { Content } from '../../types/Content';
import { InputGroup, LongTextInput, ShortTextInput, StateButton } from './InputElements';
import InputArea from './InputArea';
import { ReducerAction, SetReducer, UpdateReducer } from '../../types/ManageContent';
import ContentBody from '../Shared/ContentBody';

/* ---------------------------- Styled Components --------------------------- */

const BaseContentManagementArea = styled.div``;

const BodyPreview = styled(ContentBody)`
  margin-top: 2rem;
  max-width: 120rem;
  width: 80%;
  border: 0.1rem solid ${(props) => props.theme.darkTone};
`;

/* -------------------------------------------------------------------------- */

interface baseContentManagementProps {
  baseContentData: Content;
  setBaseContentData: React.Dispatch<SetReducer<Content> | UpdateReducer<Content, keyof Content>>;
  // Possible errors in an input with key being field and value being error message
  validationErrors: Record<string, string>;
}

// Form part for inputting the data about the base content
const BaseContentManagement = ({
  baseContentData,
  setBaseContentData,
  validationErrors,
}: baseContentManagementProps) => {
  const [viewPreview, setViewPreview] = useState(false);

  return (
    <BaseContentManagementArea>
      <InputGroup>
        <InputArea
          labelText={'Title'}
          error={validationErrors['title']}
          InputElement={
            <ShortTextInput
              type='text'
              value={baseContentData.title}
              onChange={(e) =>
                setBaseContentData({
                  action: ReducerAction.Update,
                  field: 'title',
                  value: e.target.value,
                })
              }
            />
          }
        />

        <InputArea
          labelText={'Slug'}
          error={validationErrors['slug']}
          InputElement={
            <ShortTextInput
              type='text'
              value={baseContentData.slug}
              onChange={(e) =>
                setBaseContentData({
                  action: ReducerAction.Update,
                  field: 'slug',
                  value: e.target.value,
                })
              }
            />
          }
        />

        <InputArea
          labelText={'Description'}
          error={validationErrors['content_desc']}
          InputElement={
            <ShortTextInput
              type='text'
              value={baseContentData.content_desc || ''}
              onChange={(e) =>
                setBaseContentData({
                  action: ReducerAction.Update,
                  field: 'content_desc',
                  value: e.target.value,
                })
              }
            />
          }
        />
      </InputGroup>

      <InputArea
        labelText={'Content Body (Markdown)'}
        error={validationErrors['body']}
        InputElement={
          <LongTextInput
            value={baseContentData.body}
            onChange={(e) =>
              setBaseContentData({
                action: ReducerAction.Update,
                field: 'body',
                value: e.target.value,
              })
            }
          />
        }
      />

      <InputArea
        labelText={'Content Body Preview'}
        InputElement={
          <>
            <StateButton active={viewPreview} onClick={() => setViewPreview(!viewPreview)}>
              View Body Preview
            </StateButton>
            {viewPreview && <BodyPreview>{baseContentData.body}</BodyPreview>}
          </>
        }
      />
    </BaseContentManagementArea>
  );
};

export default BaseContentManagement;
