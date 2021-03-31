import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  LoadingSpinner,
  ErrorOverlay,
  StageRaceListGroup,
  StageRaceListGroupItem,
  StageRaceFormStageListGroup,
  StageRaceFormStageListGroupItem,
  StageRaceFormTotals,
  FormInputGroup,
  ButtonWrapper,
  PrimaryButton,
  SecondaryOutlineButton,
  SuccessOutlineButton,
  DangerOutlineButton,
  Modal,
} from "./shared";
import uniqid from "uniqid";
import { getStageRaces, addStageRace, deleteStageRace } from "../api";
import { IStage, IStageRace } from "../types";

interface ISuccess {
  value?: boolean;
  message?: string;
}
interface IStageRaceForm {
  name: string;
}
interface IStageForm {
  name: string;
  date: string;
}

const App: React.FC = () => {
  const [races, setRaces] = useState<IStageRace[]>([]);
  const [isGetSuccess, setIsGetSuccess] = useState<ISuccess>({});
  const [error, setError] = useState<ISuccess>({});
  const [stageRaceForm, setStageRaceForm] = useState<IStageRaceForm>({
    name: "",
  });
  const [stageForm, setStageForm] = useState<IStageForm>({
    name: "",
    date: "",
  });
  const [stageRaceData, setStageRaceData] = useState<IStage[]>([]);
  const [openModal, setOpenModal] = useState({
    stageRaceForm: false,
    stageForm: false,
  });

  const fetchRaces = useCallback(() => {
    getStageRaces()
      .then((item) => {
        setIsGetSuccess({ value: true });
        setRaces(item.reverse());
      })
      .catch(() =>
        setIsGetSuccess({ value: false, message: "Error loading stage races" })
      );
  }, []);

  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);

  const handleDeleteRace = (id: number) => {
    deleteStageRace(id)
      .then(() => setRaces(races.filter(e => e.id !== id)))
      .catch(() => setError({ value: true, message: "Error deleting stage race" }));
  };

  const handlePostStageData = () => {
    const postData = {
      name: stageRaceForm.name,
      stages: stageRaceData,
    };
    addStageRace(postData)
      .then(() => {
        setStageRaceData([]);
        setStageRaceForm({ name: "" });
        setOpenModal({ ...openModal, stageRaceForm: false });
        const id = (races[races.length - 1]?.id || 0) + 1;
        setRaces([
          ...races,
          {
            id,
            ...postData,
          },
        ]);
      })
      .catch(() =>
        setError({ value: true, message: "Error adding stage race" })
      );
  };

  const handleOnChangeStageRace = ({
    currentTarget: { value },
  }: React.FormEvent<HTMLInputElement>): void => {
    setStageRaceForm({ ...stageRaceForm, name: value });
  };

  const handleAddStageRaceFormData = () => {
    const { name, date } = stageForm;
    const sorted = [{ id: uniqid(), name, date }, ...stageRaceData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setStageRaceData(sorted);
    setOpenModal({ stageRaceForm: true, stageForm: false });
    setStageForm({ name: "", date: "" });
  };

  const handleRemoveStageRaceFormData = (id: string) => {
    setStageRaceData(stageRaceData.filter((e) => e.id !== id));
  };

  const handleCancelStageForm = () => {
    setStageForm({ name: "", date: "" });
    setOpenModal({ stageRaceForm: true, stageForm: false });
  };

  const handleCancelStageRaceForm = () => {
    setOpenModal({ ...openModal, stageRaceForm: false });
    setStageRaceData([]);
  };

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {!races.length && !isGetSuccess.value && <LoadingSpinner />}
      {!races.length && isGetSuccess.value && <h4>No stage races</h4>}
      {races.map((race: IStageRace) => {
        return (
          <StageRaceListGroup key={race.id}>
            <StageRaceListGroupItem
              key={race.id}
              id={race.id}
              name={race.name}
              date={race.stages[0].date}
              duration={`${race.stages.length} ${
                race.stages.length > 1 ? "days" : "day"
              }`}
              onDelete={() => handleDeleteRace(race.id)}
            />
          </StageRaceListGroup>
        );
      })}
      {(isGetSuccess.message || error.value) && (
        <ErrorOverlay
          error={isGetSuccess?.message || error.message || ""}
          clearError={() => {
            setIsGetSuccess({ ...isGetSuccess, message: "" });
            setError({});
          }}
        />
      )}
      {isGetSuccess.value && (
        <ButtonWrapper>
          <PrimaryButton
            onClick={() => setOpenModal({ ...openModal, stageRaceForm: true })}
          >
            Add Stage Race
          </PrimaryButton>
        </ButtonWrapper>
      )}
      <Modal isOpen={openModal.stageRaceForm || openModal.stageForm}>
        {!openModal.stageForm ? (
          <StageRaceFormStageListGroup>
            <h3>Add Stage Race</h3>
            <FormInputGroup
              id="stage-race"
              placeholder="Enter stage race name"
              onChange={handleOnChangeStageRace}
              value={stageRaceForm.name}
            />
            <h3>Stages</h3>
            {!stageRaceData.length && <h6>No stages</h6>}
            {stageRaceData.map((e) => (
              <StageRaceFormStageListGroupItem
                key={e.id}
                id={e.id}
                date={e.date}
                name={e.name}
                onDelete={() => handleRemoveStageRaceFormData(e.id)}
              />
            ))}
            <StageRaceFormTotals
              duration={`${stageRaceData.length} ${
                stageRaceData.length === 1 ? "day" : "days"
              }`}
            />
            <ButtonWrapper>
              <SecondaryOutlineButton
                onClick={() =>
                  setOpenModal({ stageRaceForm: false, stageForm: true })
                }
                disabled={!stageRaceForm.name}
              >
                Add Stage
              </SecondaryOutlineButton>
              <SuccessOutlineButton
                onClick={handlePostStageData}
                disabled={!stageRaceData.length}
              >
                Save
              </SuccessOutlineButton>
              <DangerOutlineButton onClick={handleCancelStageRaceForm}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </StageRaceFormStageListGroup>
        ) : (
          <>
            <h3>Add Stage</h3>
            <FormInputGroup
              id="Name"
              label="Name"
              onChange={({ target: { value } }) =>
                setStageForm({ ...stageForm, name: value })
              }
              value={stageForm.name}
            />
            <FormInputGroup
              id="Date"
              label="Date"
              type="date"
              onChange={({ target: { value } }) =>
                setStageForm({ ...stageForm, date: value })
              }
              value={stageForm.date}
            />
            <ButtonWrapper>
              <SuccessOutlineButton
                onClick={() => handleAddStageRaceFormData()}
                disabled={
                  !stageForm.name &&
                  new Date(stageForm.date).toString() === "Invalid Date"
                }
              >
                Save
              </SuccessOutlineButton>
              <DangerOutlineButton onClick={() => handleCancelStageForm()}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default App;
