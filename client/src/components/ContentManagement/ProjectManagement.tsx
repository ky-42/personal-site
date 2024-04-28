import styled from 'styled-components';
import { Project, ProjectStatus } from '../../types/Content';
import { ReducerAction, SetReducer, UpdateReducer } from '../../types/ManageContent';
import { DateInput, DropDown, InputGroup, ShortTextInput } from './InputElements';
import InputArea from './InputArea';

/* -------------------------------------------------------------------------- */

const ProjectManagementArea = styled.div``;

/* -------------------------------------------------------------------------- */

interface projectManagementProps {
  projectData: Project;
  setProjectData: React.Dispatch<SetReducer<Project> | UpdateReducer<Project, keyof Project>>;
  // Possible errors in an input with key being field and value being error message
  validationErrors: Record<string, string>;
}

// Form part for inputting data about the project specific parts of content
const ProjectManagement = ({
  projectData,
  setProjectData,
  validationErrors,
}: projectManagementProps) => {
  return (
    <ProjectManagementArea>
      <InputArea
        labelText={'Project Status'}
        error={validationErrors['current_status']}
        InputElement={
          <DropDown
            value={projectData.current_status}
            onChange={(e) =>
              setProjectData({
                action: ReducerAction.Update,
                field: 'current_status',
                value: e.target.value as ProjectStatus,
              })
            }
          >
            <option value={ProjectStatus.UnderDevelopment}>Under Development</option>
            <option value={ProjectStatus.Finished}>Finished</option>
          </DropDown>
        }
      />

      <InputGroup>
        <InputArea
          labelText={'Repository URL'}
          error={validationErrors['repository_url']}
          InputElement={
            <ShortTextInput
              type='text'
              placeholder='https://github.com/ky-42/personal-site'
              value={projectData.repository_url ? projectData.repository_url : ''}
              onChange={(e) =>
                setProjectData({
                  action: ReducerAction.Update,
                  field: 'repository_url',
                  value: e.target.value,
                })
              }
            />
          }
        />

        <InputArea
          labelText={'Website URL'}
          error={validationErrors['website_url']}
          InputElement={
            <ShortTextInput
              type='text'
              placeholder='https://kyledenief.me/'
              value={projectData.website_url ? projectData.website_url : ''}
              onChange={(e) =>
                setProjectData({
                  action: ReducerAction.Update,
                  field: 'website_url',
                  value: e.target.value,
                })
              }
            />
          }
        />

        <InputArea
          labelText={'Project Start Date'}
          error={validationErrors['start_date']}
          InputElement={
            <DateInput
              type='date'
              value={
                projectData.start_date
                  ? projectData.start_date.toISOString().slice(0, 10)
                  : new Date().toDateString()
              }
              onChange={(e) =>
                setProjectData({
                  action: ReducerAction.Update,
                  field: 'start_date',
                  value: new Date(e.target.value),
                })
              }
            />
          }
        />
      </InputGroup>
    </ProjectManagementArea>
  );
};

export default ProjectManagement;
