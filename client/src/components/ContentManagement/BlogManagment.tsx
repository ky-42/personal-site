import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Blog } from '../../types/Content';
import { EnterButton, InputButtonHolder, ShortTextInput } from './InputElements';
import { ReducerAction, SetReducer, UpdateReducer } from '../../types/ManageContent';
import InputArea from './InputArea';
import { AiOutlineRight } from 'react-icons/ai';
import { ManageTag } from '../Shared/Buttons';
import { ContentOperations, DevblogOperations } from '../../adapters/content';
import { RequestStatus } from '../../types/RequestContent';
import { NotificationContext, NotificationType } from '../../contexts/Notification';

/* ---------------------------- Styled Components --------------------------- */

const BlogManagmentArea = styled.div``;

const IdHolder = styled.p`
  text-align: center;
`;

const TextButton = styled(EnterButton)`
  width: auto;
  padding: 1rem;
  margin: 0;
  margin-left: 1rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 1rem;
  column-gap: 1rem;
  max-width: 80rem;
`;

/* -------------------------------------------------------------------------- */

interface blogManagmentProps {
  blogData: Blog;
  setBlogData: React.Dispatch<SetReducer<Blog> | UpdateReducer<Blog, keyof Blog>>;
  tags: Set<string>;
  setTags: React.Dispatch<React.SetStateAction<Set<string>>>;
  // Possible errors in an input with key being feild and value being error message
  validationErrors: Record<string, string>;
}

// Form part for inputing data about the blog specific parts of content
const BlogManagment = ({
  blogData,
  setBlogData,
  tags,
  setTags,
  validationErrors,
}: blogManagmentProps) => {
  const notifications = useContext(NotificationContext);

  // State for current tag being typed
  const [currentTag, setCurrentTag] = useState<string>('');

  // State for current slug or title being typed
  const [projectSlug, setProjectSlug] = useState<string>('');
  const [devblogTitle, setDevblogTitle] = useState<string>('');

  /* ------------------------------- Id Requests ------------------------------ */

  // Request content with a slug and sets proejctId if successful
  const getProjectId = (slug: string) => {
    ContentOperations.get_content({ slug: slug }).then((content) => {
      switch (content.requestStatus) {
        case RequestStatus.Success:
          setBlogData({
            action: ReducerAction.Update,
            field: 'related_project_id',
            value: content.requestedData.base_content.id,
          });
          break;

        case RequestStatus.Error:
        case RequestStatus.Loading:
          notifications.addNotification({
            message: 'Error getting project id',
            type: NotificationType.Error,
          });

          console.log('Error getting project id');
          break;
      }
    });
  };

  // Request content with a title and sets devblogId if successful
  const getDevblogId = (title: string) => {
    DevblogOperations.get_devblog_object({ title: title }).then((devblog) => {
      switch (devblog.requestStatus) {
        case RequestStatus.Success:
          setBlogData({
            action: ReducerAction.Update,
            field: 'devblog_id',
            value: devblog.requestedData.id,
          });
          break;

        case RequestStatus.Error:
        case RequestStatus.Loading:
          notifications.addNotification({
            message: 'Error getting devblog id',
            type: NotificationType.Error,
          });

          console.log('Error getting devblog id');
          break;
      }
    });
  };

  /* -------------------------------------------------------------------------- */

  // Removes tag from tags set state
  const removeTag = (tag: string) => {
    setTags((current) => {
      current.delete(tag);
      return new Set(current);
    });
  };

  return (
    <BlogManagmentArea>
      <InputArea
        lableText={'Tags'}
        InputElement={
          <div>
            <InputButtonHolder>
              <ShortTextInput
                type='text'
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
              />
              <TextButton
                onClick={() => {
                  setTags((current) => {
                    current.add(currentTag);
                    return new Set(current);
                  });
                  setCurrentTag('');
                }}
              >
                Add
              </TextButton>
            </InputButtonHolder>
            <br />
            <TagsList>
              {Array.from(tags).map((tag) => {
                return <ManageTag tagString={tag} removeTag={removeTag} key={tag} />;
              })}
            </TagsList>
          </div>
        }
      />

      <InputArea
        lableText={'Slug of Related Project'}
        error={validationErrors['realated_project_id']}
        InputElement={
          <div>
            <InputButtonHolder>
              <ShortTextInput
                type='text'
                value={projectSlug}
                onChange={(e) => setProjectSlug(e.target.value)}
              />
              <EnterButton
                onClick={() => {
                  getProjectId(projectSlug);
                  setProjectSlug('');
                }}
              >
                <AiOutlineRight />
              </EnterButton>
            </InputButtonHolder>
            <InputButtonHolder>
              <IdHolder>{`Id of Related Project: ${blogData.related_project_id}`}</IdHolder>
              <TextButton
                onClick={() =>
                  setBlogData({
                    action: ReducerAction.Update,
                    field: 'related_project_id',
                    value: undefined,
                  })
                }
              >
                Clear
              </TextButton>
            </InputButtonHolder>
          </div>
        }
      />

      <InputArea
        lableText={'Title of Devblog'}
        error={validationErrors['devblog_id']}
        InputElement={
          <div>
            <InputButtonHolder>
              <ShortTextInput
                type='text'
                value={devblogTitle}
                onChange={(e) => setDevblogTitle(e.target.value)}
              />
              <EnterButton
                onClick={() => {
                  getDevblogId(devblogTitle);
                  setDevblogTitle('');
                }}
              >
                <AiOutlineRight />
              </EnterButton>
            </InputButtonHolder>
            <InputButtonHolder>
              <IdHolder>{`Id of Devblog: ${blogData.devblog_id}`}</IdHolder>
              <TextButton
                onClick={() =>
                  setBlogData({
                    action: ReducerAction.Update,
                    field: 'devblog_id',
                    value: undefined,
                  })
                }
              >
                Clear
              </TextButton>
            </InputButtonHolder>
          </div>
        }
      />
    </BlogManagmentArea>
  );
};

export default BlogManagment;
