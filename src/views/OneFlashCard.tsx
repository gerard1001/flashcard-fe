import { gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import {
  cardErrorAction,
  loadingReadCardAction,
  readCardAction,
} from "../redux/reducers/card.reducer";
import { RootState } from "../redux/store";
import * as FaIcons from "react-icons/fa";

const READ_CARD = gql`
  mutation ReadCard($id: Int!, $confidence: Int!) {
    readCard(id: $id, confidence: $confidence) {
      id
      usersRead {
        user {
          id
          name
        }
      }
    }
  }
`;

function OneFlashCard() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardsData = useSelector((state: RootState) => state.cardReducer);
  const [flipped, setflipped] = useState(false);
  const [selectConfidence, setselectConfidence] = useState<number>(5);

  const [readCard] = useMutation(READ_CARD);

  const activeCard = cardsData.data?.cards.filter(
    (card) => card.id === parseInt(params.id as string)
  )[0];

  const handleSubmit = async () => {
    dispatch(loadingReadCardAction({}));
    await readCard({
      variables: {
        id: parseInt(params.id!),
        confidence: selectConfidence,
      },
      onError(error) {
        toast.error(error.message);
        dispatch(cardErrorAction(error.message));
      },
      onCompleted(data) {
        dispatch(readCardAction(data.readCard));

        setflipped(false);
      },
    });
  };

  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/");
    }
  });

  return (
    <>
      <NavBar>
        <div
          style={{
            position: "absolute",
            left: "40px",
            fontSize: "40px",
          }}
        >
          <FaIcons.FaArrowCircleLeft
            id="downArrow"
            style={{
              height: "20px",
              color: "#fff",
              fontSize: "40px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/flashcard");
            }}
          />
        </div>
      </NavBar>
      <div
        style={{
          fontFamily: " Arial, Helvetica, sans-serif",
          fontSize: "20px",
        }}
      >
        <div
          style={{
            marginTop: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: "column nowrap",
            gap: "10px",
            height: "calc(100% - 70px)",
          }}
        >
          <div
            style={{
              maxWidth: "400px",
              width: "100%",
              backgroundColor: "#1da1f2",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexFlow: "column nowrap",
              position: "relative",
              marginTop: "200px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                position: "absolute",
                top: "20px",
                left: "10px",
                fontFamily: " Arial, Helvetica, sans-serif",
                color: "#fff",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#000" }}>
                Card created by:
              </span>{" "}
              : {activeCard?.author.name.toLocaleUpperCase()}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                flexFlow: "column nowrap",
              }}
            >
              <span
                style={{
                  fontSize: "60px",
                  fontWeight: "bold",
                  fontFamily: " Arial, Helvetica, sans-serif",
                  textDecoration: "underline",
                  margin: "20px",
                }}
              >
                {flipped ? "Answer" : "Question"}
              </span>
              <span
                color={flipped ? "secondary.light" : "black"}
                style={{
                  fontSize: "16px",
                }}
              >
                {flipped ? activeCard?.answer : activeCard?.question}
              </span>
            </div>
            <span
              style={{
                fontWeight: "bold",
                position: "absolute",
                bottom: "10px",
                left: "15px",
                fontSize: "16px",
                fontFamily: " Arial, Helvetica, sans-serif",
              }}
            >
              Reads:{" "}
              <span style={{ color: "#fff" }}>
                {activeCard?.usersRead.length}
              </span>
            </span>
            <div
              style={{ position: "absolute", bottom: "10px", right: "15px" }}
            >
              {activeCard?.usersRead.filter(
                (user) =>
                  user.user.id ===
                  parseInt(localStorage.getItem("userId") as string)
              ).length === 0 ? (
                <span
                  color={flipped ? "secondary.light" : "white"}
                  style={{
                    fontSize: "16px",
                    color: "#fff",
                  }}
                >
                  {flipped ? "Viewed" : "Not Viewed"}
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: " Arial, Helvetica, sans-serif",
                    color: "#fff",
                    fontSize: "16px",
                  }}
                >
                  Viewed
                </span>
              )}
            </div>
          </div>
          {flipped ? (
            <span
              style={{
                fontSize: "15px",
                marginTop: "10px",
                color: "#004c6f",
              }}
            >
              Out of five, how close was your answer to the true value?
            </span>
          ) : null}

          {flipped ? (
            <div
              style={{
                maxWidth: "400px",
                width: "100%",
                gap: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select
                style={{
                  width: "40%",
                  height: "40px",
                  fontSize: "18px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                value={selectConfidence}
                onChange={(e) => {
                  setselectConfidence(parseInt(e.target.value as string));
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <button
                onClick={() => handleSubmit()}
                disabled={cardsData.loadingRead}
                style={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cardsData.loadingRead ? (
                  <p>Loading...</p>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setflipped(true);
              }}
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "400px",
                width: "100%",
              }}
            >
              <span
                style={{
                  fontFamily: " Arial, Helvetica, sans-serif",
                  fontWeight: "bold",
                }}
              >
                Click to View the Answer
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default OneFlashCard;
