import { CrewAssignment } from "../api/crews.d";
import {
  CrewsActionTypes,
  GET_ALL_CREWS_START,
  GET_ALL_CREWS_SUCCESS,
  GET_ALL_CREWS_FAILURE,
  CREATE_CREW_START,
  CREATE_CREW_SUCCESS,
  CREATE_CREW_FAILURE,
  UPDATE_CREW_START,
  UPDATE_CREW_SUCCESS,
  UPDATE_CREW_FAILURE,
  DELETE_CREW_START,
  DELETE_CREW_SUCCESS
} from "./types/crews";

export interface CrewsState {
  isGettingAllCrews: boolean;
  getAllCrewsErrorMessage: string;
  isCreatingCrew: boolean;
  createCrewErrorMessage: string;
  isUpdatingCrew: boolean;
  updateCrewErrorMessage: string;
  isDeletingCrew: boolean;
  deleteCrewErrorMessage: string;

  crewAssignments: CrewAssignment[];
}

const initialState: CrewsState = {
  isGettingAllCrews: false,
  getAllCrewsErrorMessage: "",
  isCreatingCrew: false,
  createCrewErrorMessage: "",
  isUpdatingCrew: false,
  updateCrewErrorMessage: "",
  isDeletingCrew: false,
  deleteCrewErrorMessage: "",

  crewAssignments: []
};

const reducer = (state = initialState, action: CrewsActionTypes): CrewsState => {
  switch (action.type) {
    case GET_ALL_CREWS_START:
      return {
        ...state,
        isGettingAllCrews: true,
        getAllCrewsErrorMessage: ""
      };
    case GET_ALL_CREWS_SUCCESS:
      return {
        ...state,
        isGettingAllCrews: false,
        crewAssignments: action.body.crewAssignment
      };
    case GET_ALL_CREWS_FAILURE:
      return {
        ...state,
        isGettingAllCrews: false,
        getAllCrewsErrorMessage: action.body.error.message
      };
    case CREATE_CREW_START:
      return {
        ...state,
        isCreatingCrew: true,
        createCrewErrorMessage: ""
      };
    case CREATE_CREW_SUCCESS:
      return {
        ...state,
        isCreatingCrew: false,
        crewAssignments: [...state.crewAssignments, action.body.crewAssignment]
      };
    case CREATE_CREW_FAILURE:
      return {
        ...state,
        isCreatingCrew: false,
        createCrewErrorMessage: action.body.error.message
      };
    case UPDATE_CREW_START:
      return {
        ...state,
        isUpdatingCrew: true,
        updateCrewErrorMessage: ""
      };
    case UPDATE_CREW_SUCCESS:
      return {
        ...state,
        isUpdatingCrew: false,
        crewAssignments: [
          ...state.crewAssignments.filter((crewAssignment) => crewAssignment._id !== action.body.crewAssignment._id),
          action.body.crewAssignment
        ]
      };
    case UPDATE_CREW_FAILURE:
      return {
        ...state,
        isUpdatingCrew: false,
        updateCrewErrorMessage: action.body.error.message
      };
    case DELETE_CREW_START:
      return {
        ...state,
        isDeletingCrew: true,
        deleteCrewErrorMessage: ""
      };
    case DELETE_CREW_SUCCESS:
      return {
        ...state,
        isDeletingCrew: false,
        crewAssignments: state.crewAssignments.filter(
          (crewAssignment) => crewAssignment._id !== action.body.crewAssignment._id
        )
      };
    default:
      return state;
  }
};

export default reducer;
