import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {User} from '../types/user';
import {Parent} from '../types/parent';
import {Student} from '../types/student';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<User | Parent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<Student | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser?.uid) {
          setError('Aucun utilisateur connecté');
          setLoading(false);
          return;
        }

        // Récupération des données utilisateur depuis Realtime Database
        const userSnapshot = await database()
          .ref(`/users/${currentUser.uid}`)
          .once('value');

        if (!userSnapshot.exists()) {
          setError('Données utilisateur non trouvées');
          setLoading(false);
          return;
        }

        // Obtenir les données utilisateur
        const user = userSnapshot.val() as User;
        setUserData(user);

        // Si c'est un parent, récupérer les données des enfants
        if (user.role === 'parent') {
          const parentData = user as Parent;
          if (parentData.children && parentData.children.length > 0) {
            const childrenData: Student[] = [];

            // Pour chaque enfant, récupérer ses données complètes
            for (const child of parentData.children) {
              if (child) {
                const childSnapshot = await database()
                  .ref(`/users/${child}`)
                  .once('value');

                if (childSnapshot.exists()) {
                  childrenData.push(childSnapshot.val() as Student);
                }
              }
            }

            setChildren(childrenData);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Erreur lors du chargement des données utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    auth().signOut();
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3464A3" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const openChildModal = (child: Student) => {
    setSelectedChild(child);
    setModalVisible(true);
  };

  const closeChildModal = () => {
    setModalVisible(false);
    setSelectedChild(null);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header avec bouton de déconnexion */}
      <StatusBar backgroundColor="#3464A3" barStyle="light-content" />
      <View style={styles.topHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>MathéMagique</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}>
            <Icon name="logout" size={18} color="#FFF" />
            <Text style={styles.signOutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>
            Bienvenue {userData?.firstName} {userData?.lastName}
          </Text>
          <Text style={styles.role}>{'Parent'}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="account" size={24} color="#3464A3" />
            <Text style={styles.cardTitle}>Informations personnelles</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom:</Text>
            <Text style={styles.infoValue}>{userData?.lastName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prénom:</Text>
            <Text style={styles.infoValue}>{userData?.firstName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de naissance:</Text>
            <Text style={styles.infoValue}>{userData?.dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rôle:</Text>
            <Text style={styles.infoValue}>
              {userData?.role === 'teacher' ? 'Enseignant' : 'Parent'}
            </Text>
          </View>
        </View>

        {userData?.role === 'parent' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="account-child" size={24} color="#3464A3" />
              <Text style={styles.cardTitle}>Mes enfants</Text>
            </View>

            {children.length > 0 ? (
              children.map(child => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.childCard}
                  onPress={() => {
                    /* Navigation vers le détail de l'enfant */
                    openChildModal(child);
                  }}>
                  <View style={styles.childHeader}>
                    <Icon
                      name={child.gender === 'male' ? 'face-man' : 'face-woman'}
                      size={22}
                      color="#3464A3"
                    />
                    <Text style={styles.childName}>
                      {child.firstName} {child.lastName}
                    </Text>
                  </View>

                  <View style={styles.childInfo}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Classe:</Text>
                      <Text style={styles.infoValue}>{child.grade}</Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Niveau math:</Text>
                      <Text style={styles.infoValue}>
                        {child.playerProfile?.mathLevel || 'Non défini'}
                      </Text>
                    </View>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              (child.playerProfile?.mathLevel || 0) * 10
                            }%`,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Icon name="star" size={18} color="#FFD700" />
                        <Text style={styles.statText}>
                          {child.playerProfile?.score || 0} pièces
                        </Text>
                      </View>

                      <View style={styles.statItem}>
                        <Icon name="check-circle" size={18} color="#27AE60" />
                        <Text style={styles.statText}>
                          {child.playerProfile?.score * 2 || 0} problèmes résolus
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noChildrenContainer}>
                <Icon name="account-child-outline" size={80} color="#CCDDEE" />
                <Text style={styles.noChildrenTitle}>
                  Aucun enfant enregistré
                </Text>
                <Text style={styles.noChildrenText}>
                  Vous n'avez pas encore d'enfants associés à votre compte.
                </Text>
                <View style={styles.addChildBorder}>
                  <TouchableOpacity style={styles.addChildButton}>
                    <Icon name="account-plus" size={24} color="#FFF" />
                    <Text style={styles.addChildText}>Ajouter un enfant</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.noChildrenIllustration}>
                  <Icon
                    name="school"
                    size={30}
                    color="#3464A3"
                    style={styles.illustrationIcon}
                  />
                  <Icon
                    name="math-compass"
                    size={26}
                    color="#FF7043"
                    style={styles.illustrationIcon}
                  />
                  <Icon
                    name="book-open-page-variant"
                    size={28}
                    color="#4CAF50"
                    style={styles.illustrationIcon}
                  />
                  <Icon
                    name="palette"
                    size={26}
                    color="#9C27B0"
                    style={styles.illustrationIcon}
                  />
                  <Icon
                    name="atom"
                    size={28}
                    color="#FF9800"
                    style={styles.illustrationIcon}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal pour afficher les détails de l'enfant */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeChildModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Progression de {selectedChild?.firstName}{' '}
                {selectedChild?.lastName}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeChildModal}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.studentInfoSummary}>
                <View style={styles.studentAvatar}>
                  <Icon
                    name={
                      selectedChild?.gender === 'male'
                        ? 'face-man'
                        : 'face-woman'
                    }
                    size={60}
                    color="#3464A3"
                  />
                </View>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>
                    {selectedChild?.firstName} {selectedChild?.lastName}
                  </Text>
                  <Text style={styles.studentStat}>
                    Niveau actuel:{' '}
                    <Text style={styles.statValue}>
                      {selectedChild?.playerProfile?.mathLevel || 'Non défini'}
                    </Text>
                  </Text>
                  <Text style={styles.studentStat}>
                    Score total:{' '}
                    <Text style={styles.statValue}>
                      {selectedChild?.playerProfile?.score || 0}
                    </Text>
                  </Text>
                </View>
              </View>

              {selectedChild?.historyMathLevel &&
              selectedChild.historyMathLevel.length > 0 ? (
                <View style={styles.historyContainer}>
                  <Text style={styles.historyTitle}>
                    Historique des niveaux
                  </Text>
                  <ScrollView style={styles.historyScroll}>
                    <View style={styles.historyTable}>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, {flex: 2}]}>
                          Date
                        </Text>
                        <Text style={[styles.tableHeaderCell, {flex: 1}]}>
                          Niveau
                        </Text>
                      </View>
                      {selectedChild.historyMathLevel.map((history, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, {flex: 2}]}>
                            {new Date(history.date).toLocaleDateString('fr-FR')}
                          </Text>
                          <Text style={[styles.tableCell, {flex: 1}]}>
                            {history.level}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.noHistoryMessage}>
                  <Icon name="alert-circle-outline" size={40} color="#CCDDEE" />
                  <Text style={styles.noHistoryText}>
                    Aucun historique de progression disponible pour cet élève.
                  </Text>
                </View>
              )}

              <View style={styles.gameProgressContainer}>
                <Text style={styles.gameProgressTitle}>
                  Progression dans les jeux
                </Text>

                {selectedChild?.gameProgress?.vertical_operations && (
                  <View style={styles.gameProgressItem}>
                    <Text style={styles.gameProgressName}>
                      Opérations Verticales
                    </Text>
                    <View style={styles.gameProgressBar}>
                      {/* Calculer un pourcentage basé sur bestScore, avec un maximum supposé de 100 */}
                      <View
                        style={[
                          styles.gameProgressFill,
                          {
                            width: `${Math.min(
                              selectedChild.gameProgress.vertical_operations
                                .bestScore || 0,
                              100,
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.gameProgressPercent}>
                      Score:{' '}
                      {selectedChild.gameProgress.vertical_operations
                        .bestScore || 0}
                    </Text>
                  </View>
                )}

                {selectedChild?.gameProgress?.find_compositions && (
                  <View style={styles.gameProgressItem}>
                    <Text style={styles.gameProgressName}>
                      Trouver les Compositions
                    </Text>
                    <View style={styles.gameProgressBar}>
                      <View
                        style={[
                          styles.gameProgressFill,
                          {
                            width: `${Math.min(
                              selectedChild.gameProgress.find_compositions
                                .bestScore || 0,
                              100,
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.gameProgressPercent}>
                      Score:{' '}
                      {selectedChild.gameProgress.find_compositions.bestScore ||
                        0}
                    </Text>
                  </View>
                )}

                {selectedChild?.gameProgress?.choose_answer && (
                  <View style={styles.gameProgressItem}>
                    <Text style={styles.gameProgressName}>
                      Choisir la Réponse
                    </Text>
                    <View style={styles.gameProgressBar}>
                      <View
                        style={[
                          styles.gameProgressFill,
                          {
                            width: `${Math.min(
                              selectedChild.gameProgress.choose_answer
                                .bestScore || 0,
                              100,
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.gameProgressPercent}>
                      Score:{' '}
                      {selectedChild.gameProgress.choose_answer.bestScore || 0}
                    </Text>
                  </View>
                )}

                {/* Ajouter des informations complémentaires sur les jeux */}
                <View style={styles.gameStatsSummary}>
                  <Text style={styles.gameStatsTitle}>Dernières activités</Text>
                  {selectedChild?.gameProgress?.vertical_operations && (
                    <Text style={styles.gameCompletedText}>
                      Opérations Verticales:{' '}
                      {new Date(
                        selectedChild.gameProgress.vertical_operations.completedAt,
                      ).toLocaleDateString('fr-FR')}
                    </Text>
                  )}
                  {selectedChild?.gameProgress?.find_compositions && (
                    <Text style={styles.gameCompletedText}>
                      Trouver les Compositions:{' '}
                      {new Date(
                        selectedChild.gameProgress.find_compositions.completedAt,
                      ).toLocaleDateString('fr-FR')}
                    </Text>
                  )}
                  {selectedChild?.gameProgress?.choose_answer && (
                    <Text style={styles.gameCompletedText}>
                      Choisir la Réponse:{' '}
                      {new Date(
                        selectedChild.gameProgress.choose_answer.completedAt,
                      ).toLocaleDateString('fr-FR')}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  topHeader: {
    backgroundColor: '#3464A3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    color: '#3464A3',
    fontSize: 16,
  },
  errorText: {
    color: '#E53935',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  infoLabel: {
    width: '40%',
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  childCard: {
    backgroundColor: '#F8FAFD',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3464A3',
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  childInfo: {
    paddingLeft: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  // Styles pour l'affichage "Aucun enfant"
  noChildrenContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFD',
    borderRadius: 10,
  },
  noChildrenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3464A3',
    marginTop: 15,
    marginBottom: 10,
  },
  noChildrenText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addChildBorder: {
    borderWidth: 1,
    borderColor: '#3464A3',
    borderRadius: 25,
    padding: 2,
  },
  addChildButton: {
    flexDirection: 'row',
    backgroundColor: '#3464A3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChildText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  noChildrenIllustration: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: 'rgba(52, 100, 163, 0.05)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '100%',
  },
  illustrationIcon: {
    marginHorizontal: 10,
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3464A3',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  studentInfoSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8FAFD',
    padding: 15,
    borderRadius: 10,
  },
  studentAvatar: {
    backgroundColor: '#EAEFF7',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentStat: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#3464A3',
  },
  historyContainer: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  historyScroll: {
    maxHeight: 200,
  },
  historyTable: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FA',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  noHistoryMessage: {
    backgroundColor: '#F8FAFD',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  noHistoryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  gameProgressContainer: {
    marginTop: 15,
    backgroundColor: '#F8FAFD',
    borderRadius: 10,
    padding: 15,
  },
  gameProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gameProgressItem: {
    marginVertical: 8,
  },
  gameProgressName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  gameProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 5,
    overflow: 'hidden',
  },
  gameProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  gameProgressPercent: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  gameStatsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  gameStatsSummary: {
    backgroundColor: '#EAEFF7',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  gameCompletedText: {
    fontSize: 13,
    color: '#555',
    marginVertical: 3,
  },
});
