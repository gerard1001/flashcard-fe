import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Box, Button, Modal, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import NavBar from "../components/NavBar";
import {
  cardErrorAction,
  CardState,
  CardType,
  createCardAction,
  deleteCardAction,
  getCardsAction,
  loadingCreateCardAction,
  loadingDeleteCardAction,
  loadingGetCardsAction,
  loadingUpdateCardAction,
  updateCardAction,
} from "../redux/reducers/card.reducer";
import { useForm } from "react-hook-form";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import "../styles/listflashcard.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

const FIND_CARD = gql`
  query Query(
    $findCardEmail2: String
    $filter: String
    $orderBy: [cardOrderByInput!]
  ) {
    findCard(email: $findCardEmail2, filter: $filter, orderBy: $orderBy) {
      count
      cards {
        id
        question
        answer
        author {
          name
        }
        usersRead {
          user {
            name
            id
          }
        }
      }
    }
  }
`;
const CREATE_CARD = gql`
  mutation ($question: String!, $answer: String!) {
    createCard(question: $question, answer: $answer) {
      id
      question
      answer
      author {
        name
      }
      usersRead {
        user {
          name
          id
        }
      }
    }
  }
`;
const UPDATE_CARD = gql`
  mutation UpdateCard($id: Int!, $question: String, $answer: String) {
    updateCard(id: $id, question: $question, answer: $answer) {
      id
      question
      answer
      author {
        name
      }
      usersRead {
        user {
          name
          id
        }
      }
    }
  }
`;
const DELETE_CARD = gql`
  mutation DeleteCard($id: Int!) {
    deleteCard(id: $id) {
      id
    }
  }
`;

function ListFlashCard() {
  const cardsData: CardState = useSelector(
    (state: RootState) => state.cardReducer
  );
  const [author, setAuthor] = useState<string | undefined>(undefined);
  const [filter, setfilter] = useState<string | undefined>(undefined);
  const [selectCreateAt, setSelectCreateAt] = useState<string | undefined>(
    "asc"
  );
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const dispatch: Dispatch = useDispatch();
  const [
    findCards,
    { data: findData, loading: findLoading, error: findError },
  ] = useLazyQuery(FIND_CARD);
  const [
    createCard,
    { data: createData, loading: createLoading, error: createError },
  ] = useMutation(CREATE_CARD);
  const [
    updateCard,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_CARD);
  const [
    deleteCard,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_CARD);
  const {
    register: createRegister,
    reset: createReset,
    getValues: createGetValues,
    handleSubmit: createHandleSubmit,
  } = useForm();
  const {
    register: updateRegister,
    reset: updateReset,
    getValues: updateGetValues,
    handleSubmit: updateHandleSubmit,
    setValue: updateSetValue,
  } = useForm();

  const getCards = async () => {
    let variables = {};

    if (author) {
      variables = Object.assign(variables, { findCardEmail2: author });
    }
    if (filter) {
      variables = Object.assign(variables, { filter });
    }
    if (selectCreateAt) {
      variables = Object.assign(variables, {
        orderBy: [{ createdAt: selectCreateAt }],
      });
    }

    dispatch(loadingGetCardsAction({}));
    await findCards({
      variables,
      fetchPolicy: "network-only",
      onError: (error) => {},
    })
      .then((value) => {
        if (value.error) {
          throw value.error;
        }
        dispatch(getCardsAction(value.data.findCard));
      })
      .catch((error) => {
        toast.error(error.message);
        dispatch(cardErrorAction(error));
      });
  };
  const handleCreateCard = async (data: object) => {
    dispatch(loadingCreateCardAction({}));
    await createCard({
      variables: data,
      onError: (error) => {
        toast.error(error.message);
        dispatch(cardErrorAction(error.message));
      },
      onCompleted: (data) => {
        dispatch(createCardAction(data.createCard));
      },
    });

    createReset();
    setOpenCreateModal(false);
  };
  const handleUpdateCard = async (data: object) => {
    dispatch(loadingUpdateCardAction({}));
    await updateCard({
      variables: {
        id: activeCard,
        ...data,
      },
      onError: (error) => {
        toast.error(error.message);
        dispatch(cardErrorAction(error.message));
      },
      onCompleted: (data) => {
        dispatch(updateCardAction(data.updateCard));
      },
    });

    updateReset();
    setOpenUpdateModal(false);
  };
  const handleDeleteCard = async () => {
    dispatch(loadingDeleteCardAction({}));
    await deleteCard({
      variables: { id: activeCard },
      onError(error) {
        toast.error(error.message);
        dispatch(cardErrorAction(error.message));
      },
      onCompleted(data) {
        dispatch(deleteCardAction(activeCard!));
      },
    });

    setOpenDeleteModal(false);
  };
  const handleOpenUpdateModal = (card: CardType) => {
    updateSetValue("question", card.question);
    updateSetValue("answer", card.answer);

    setOpenUpdateModal(true);
  };

  useEffect(() => {
    getCards().then(() => {
      console.log("finished running");
    });
  }, []);

  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/");
    }
  });
  return (
    <>
      <NavBar />
      <div style={{ marginTop: "100px", fontSize: "larger" }}>
        <></>

        <h1
          style={{
            marginLeft: "100px",
            textDecoration: "underline",
            marginBottom: "20px",
            textAlign: "center",
            color: "#004463",
          }}
        >
          FILTER AND SORT YOUR CARDS
        </h1>
        <div className="contain-sort">
          <div className="sort">
            <input
              id="author"
              placeholder="Author Email"
              name="author"
              autoComplete="author"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
            <input
              id="filter"
              placeholder="Filter"
              name="filter"
              autoComplete="filter"
              value={filter}
              onChange={(e) => {
                setfilter(e.target.value);
              }}
            />
            <select
              value={selectCreateAt}
              onChange={(e) => {
                setSelectCreateAt(e.target.value);
              }}
              style={{
                height: "50px",
                width: "110px",
                paddingRight: "1ch",
                fontSize: "16px",
              }}
            >
              <option value="asc">old-new</option>
              <option value="desc">new-old</option>
              <option value="">none</option>
            </select>
            <div>
              <button
                onClick={() => getCards()}
                style={{ backgroundColor: "rgb(0, 111, 74)" }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpenCreateModal(true)}
          style={{
            margin: "0px",
            marginLeft: "280px",
            marginTop: "20px",
            marginBottom: "20px",
            width: "",
            height: "50px",
            fontSize: "16px",
            backgroundColor: "#004463",
          }}
        >
          Create Card
        </button>
        <div className="card-section">
          {!cardsData.loadingGet && cardsData.data ? (
            <div>
              {cardsData.data.cards.map((card: CardType) => (
                <div key={card.id} className="card">
                  {/* <div>{card.id}</div> */}
                  <Link
                    to={`${card.id}`}
                    style={{
                      textDecoration: "none",
                      width: "100%",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    {card.question}
                  </Link>
                  <div className="card-2">
                    <div
                      onClick={() => {
                        setActiveCard(card.id);
                        handleOpenUpdateModal(card);
                      }}
                    >
                      <FaIcons.FaRegEdit className="icons" />
                    </div>
                    <div
                      onClick={() => {
                        setActiveCard(card.id);
                        setOpenDeleteModal(true);
                      }}
                    >
                      <div
                        onClick={() => {
                          setActiveCard(card.id);
                          setOpenDeleteModal(true);
                        }}
                      >
                        <AiIcons.AiFillDelete className="icons-1" />
                      </div>
                    </div>
                    <button
                      style={{
                        width: "70px",
                        backgroundColor: "rgb(0, 47, 108)",
                        borderRadius: "5px",
                      }}
                    >
                      <Link
                        to={`${card.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                        }}
                      >
                        View
                      </Link>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <Modal
          open={openCreateModal}
          onClose={() => {
            if (!createLoading) {
              setOpenCreateModal(false);
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div className="update-modal ">
            <input
              id="question"
              placeholder="Question"
              defaultValue=""
              autoFocus
              {...createRegister("question")}
            />
            <input
              id="answer"
              placeholder="Answer"
              defaultValue=""
              {...createRegister("answer")}
            />
            <button
              onClick={createHandleSubmit(handleCreateCard)}
              disabled={createLoading}
              style={{ width: "100%", marginTop: "30px" }}
            >
              {createLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>Create</p>
                </>
              )}
            </button>
          </div>
        </Modal>
        <Modal
          open={openUpdateModal}
          onClose={() => {
            if (!updateLoading) {
              setOpenUpdateModal(false);
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div className="update-modal">
            <input
              id="question"
              placeholder="Question"
              defaultValue=""
              autoFocus
              {...updateRegister("question")}
            />
            <input
              id="answer"
              placeholder="answer"
              defaultValue=""
              {...updateRegister("answer")}
            />
            <button
              onClick={updateHandleSubmit(handleUpdateCard)}
              disabled={updateLoading}
              style={{ width: "100%", marginTop: "30px" }}
            >
              {updateLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>Update</p>
                </>
              )}
            </button>
          </div>
        </Modal>
        <Modal
          open={openDeleteModal}
          onClose={() => {
            if (!deleteLoading) {
              setOpenDeleteModal(false);
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Box
            component="div"
            sx={{
              width: "100%",
              maxWidth: "350px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          >
            <Typography fontSize="30px" color="primary.dark" fontWeight="bold">
              Delete Card
            </Typography>
            <Typography
              marginLeft="20px"
              fontSize="16px"
              color="dark"
              fontWeight="400"
            >
              Do you really wish to delete this Card?
            </Typography>
            <Stack
              marginTop="30px"
              direction="row"
              gap="10px"
              justifyContent="right"
            >
              <Button
                color="info"
                variant="contained"
                onClick={() => setOpenDeleteModal(false)}
                disabled={cardsData.loadingDelete}
              >
                {cardsData.loadingDelete ? (
                  <p>Loading..</p>
                ) : (
                  <>
                    <Typography>Cancel</Typography>
                  </>
                )}
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={handleDeleteCard}
                disabled={cardsData.loadingDelete}
              >
                {cardsData.loadingDelete ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <Typography>Delete</Typography>
                  </>
                )}
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default ListFlashCard;
