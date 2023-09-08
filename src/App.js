import { Amplify, Storage, API } from "aws-amplify";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";
//import "@aws-amplify/ui-react/styles.css";
import "./styles.css";
import awsExports from "./aws-exports";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  FormControl,
  Container,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { Delete as DeleteIcon } from "@mui/icons-material";
Amplify.configure(awsExports);


const App = ({ signOut, user }) => {
  // IMAGES
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [s3files, setS3files] = useState(null);
  const [s3Urls, sets3Urls] = useState(null);

  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageButtonText, setImageButtonText] = useState("Ajouter une image");

  const fetchImages = async () => {
    try {
      const userFiles = await Storage.list("", { level: "private" });
      setS3files(userFiles);
      const filesUrl = []; 
      for (const f of userFiles.results) {
        console.log('f:', f);
        const url = await Storage.get(f.key, { level: "private" });
        filesUrl.push(url);
      }
      sets3Urls(filesUrl);
    } catch (error) {
      console.error("Error fetching USER files:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier avant de continuer.");
      return;
    }

    setUploading(true);

    try {
      const filename = selectedFile.name;
      await Storage.put(filename, selectedFile, { level: "private" });
      alert("Le fichier a été téléchargé avec succès sur Amazon S3.");
      await fetchImages();
      setShowImageUpload(false);
      setImageButtonText("Ajouter une image");
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      alert("Une erreur s'est produite lors du téléchargement du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (filename) => {
    try {
      await Storage.remove(filename, { level: "private" });
      alert("Le fichier a été supprimé avec succès.");

      // Actualiser la liste des images après la suppression
      const updatedImages = s3files.results.filter(
        (file) => file.key !== filename
      );
      setS3files({ results: updatedImages });
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
      alert("Une erreur s'est produite lors de la suppression du fichier.");
    }
  };

  // COMMENTS
  const [location, setLocation] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formButtonText, setFormButtonText] = useState(
    "Ajouter une note de voyage"
  );

  const fetchComments = async () => {
    try {
      const response = await API.get("api2", "/placeComments");
      setComments(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires:", error);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (event, value) => {
    setRating(value);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.del("api2", `/placeComments/${commentId}`);
      alert("Le commentaire a été supprimé avec succès.");
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const commentData = {
        place: location,
        comment: comment,
        rate: rating,
      };

      const response = await API.post("api2", "/placeComments", {
        body: commentData,
      });

      console.log("Comment enregistré:", response);
      alert("Le commentaire a bien été enregistré.");

      setLocation("");
      setComment("");
      setRating(0);
      await fetchComments();
      setShowForm(false);
      setFormButtonText("Ajouter une note de voyage");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du commentaire:", error);
    }
  };

  function formatDate(dateString) {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
  }

  useEffect(() => {
    fetchComments();
    fetchImages();
  }, [s3files]);

  return (
    <div>
      <AppBar position="static" style={styles.AppBar}>
        <Toolbar>
          <Typography variant="h6" style={styles.username}>
            {user.attributes.email}
          </Typography>
          <div style={styles.grow} />

          <Button color="inherit" onClick={signOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container alignItems="top" spacing={2} style={styles.container}>
        {/* GRID IMAGE */}
        <Grid item container xs={12} md={6} justify="center">
          <Container>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowImageUpload(!showImageUpload);
                setImageButtonText(
                  showImageUpload ? "Ajouter une image" : "Annuler"
                );
              }}
              style={{
                display: "block",
                margin: "0 auto",
              }}
            >
              {imageButtonText}
            </Button>
            {showImageUpload && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={styles.buttonInverted}
                  id="fileInput"
                />
                <Button
                  variant="primary"
                  onClick={handleFileUpload}
                  disabled={uploading}
                  style={{
                    ...styles.buttonInverted,
                    marginLeft: "16px",
                  }}
                >
                  {uploading ? (
                    <Typography>Téléchargement en cours...</Typography>
                  ) : (
                    "Télécharger"
                  )}
                </Button>
              </div>
            )}
            <Box mt={3}>
              <div style={styles.imageGrid}>
                {s3Urls?.map((file, index) => (
                  <div key={index} style={styles.imageCard}>
                    <div style={styles.imageContainer}>
                      <img
                        src={file}
                        alt={file}
                        style={styles.galleryImage}
                      />
                      <Typography variant="subtitle2">{file.key}</Typography>
                      <IconButton
                        color="secondary"
                        aria-label="Supprimer"
                        style={styles.deleteIcon}
                        onClick={() => handleDeleteImage(s3files.results[index].key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          </Container>
        </Grid>

        {/* GRID COMMENT */}
        <Grid item container xs={12} md={6} justify="center">
          <Container maxWidth="sm">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowForm(!showForm);
                setFormButtonText(
                  showForm ? "Ajouter une note de voyage" : "Annuler"
                );
              }}
              style={{
                display: "block",
                margin: "0 auto",
                marginBottom: "1rem",
              }}
            >
              {formButtonText}
            </Button>
            {showForm && (
              <FormControl fullWidth>
                <TextField
                  label="Lieu"
                  value={location}
                  onChange={handleLocationChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Commentaire"
                  value={comment}
                  onChange={handleCommentChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={handleRatingChange}
                    precision={1}
                  />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCommentSubmit}
                  style={{ marginTop: "5px" }}
                >
                  Enregistrer la note
                </Button>
              </FormControl>
            )}
            <Box mt={3} style={{ display: "flex", flexWrap: "wrap" }}>
              {comments.map((comment) => (
                <Card
                  key={comment.id}
                  style={{
                    ...styles.commentCard,
                    width: "calc(50% - 8px)",
                    margin: "4px",
                    marginBottom: "16px",
                  }}
                >
                  <CardContent style={{ textAlign: "center" }}>
                    <Typography variant="h5">{comment.place}</Typography>
                    <Typography>{comment.comment}</Typography>
                    <Typography>
                      <Rating value={comment.rate} readOnly precision={1} />
                    </Typography>
                    <Typography>{formatDate(comment.createdAt)}</Typography>

                    <div style={{ textAlign: "center" }}>
                      <IconButton
                        color="secondary"
                        aria-label="Supprimer"
                        style={styles.deleteIcon}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = {
  container: {
    padding: "2vw",
  },
  button: {
    backgroundColor: "black",
    color: "#FF1493",
    outline: "none",
    fontSize: "18px",
    padding: "12px 24px",
    margin: "16px",
  },
  buttonInverted: {
    backgroundColor: "lightgreen",
    color: "black",
    outline: "none",
    fontSize: "18px",
    padding: "12px 24px",
    margin: "16px",
  },
  fileInput: {
    display: "none",
  },
  paper: {
    padding: "16px",
    marginTop: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    marginRight: "16px",
    color: "white",
  },
  grow: {
    flexGrow: 1,
  },
  AppBar: {
    backgroundColor: "green",
  },
  deleteIcon: {
    color: "green",
  },
  imagePaper: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  galleryImage: {
    maxWidth: "100%",
    maxHeight: "200px",
    marginBottom: "8px",
  },
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
  },
  imageCard: {
    width: "calc(33.33% - 16px)",
    margin: "8px",
    padding: "16px",
    backgroundColor: "#f5f5f5",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
};

export default withAuthenticator(App);
