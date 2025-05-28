import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Notification Component
const NotificationToast = ({ visible, message, type, onHide }) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  const getNotificationColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  const getNotificationIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.notificationToast,
        { 
          transform: [{ translateY: slideAnim }],
          backgroundColor: getNotificationColor(),
        }
      ]}
    >
      <Ionicons name={getNotificationIcon()} size={20} color="white" />
      <Text style={styles.notificationText}>{message}</Text>
    </Animated.View>
  );
};

// Custom Modal Component
const CustomModal = ({ visible, onClose, children, title }) => {
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Add Money Modal Component
const AddMoneyModal = ({ visible, onClose, onAddMoney }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: 'card-outline', description: 'Free transfer' },
    { id: 'card', name: 'Debit Card', icon: 'card', description: '1.5% fee applies' },
    { id: 'ussd', name: 'USSD Code', icon: 'keypad-outline', description: 'Dial *737#' },
  ];

  const quickAmounts = [1000, 5000, 10000, 25000];

  const handleAddMoney = async () => {
    const addAmount = parseInt(amount.replace(/,/g, ''));
    
    if (!addAmount || addAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (addAmount < 100) {
      Alert.alert('Error', 'Minimum amount is ₦100');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onAddMoney(addAmount, selectedMethod);
    setIsLoading(false);
    setAmount('');
    onClose();
  };

  const formatInputAmount = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue) {
      const formatted = parseInt(numericValue).toLocaleString();
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  const setQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toLocaleString());
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Add Money">
      <View style={styles.addMoneyModalContent}>
        <View style={styles.amountInputSection}>
          <Text style={styles.inputLabel}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={formatInputAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <Text style={styles.minimumAmount}>Minimum amount: ₦100</Text>
        </View>

        <View style={styles.quickAmountsSection}>
          <Text style={styles.quickAmountsLabel}>Quick amounts</Text>
          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setQuickAmount(quickAmount)}
              >
                <Text style={styles.quickAmountText}>₦{quickAmount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.paymentMethodsSection}>
          <Text style={styles.paymentMethodsLabel}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodItem,
                selectedMethod === method.id && styles.paymentMethodSelected
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <View style={[
                  styles.paymentMethodIcon,
                  selectedMethod === method.id && styles.paymentMethodIconSelected
                ]}>
                  <Ionicons 
                    name={method.icon} 
                    size={20} 
                    color={selectedMethod === method.id ? '#8b5cf6' : '#6b7280'} 
                  />
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedMethod === method.id && styles.radioButtonSelected
              ]}>
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.addMoneyButton, (!amount || isLoading) && styles.addMoneyButtonDisabled]}
          onPress={handleAddMoney}
          disabled={!amount || isLoading}
        >
          <LinearGradient
            colors={(!amount || isLoading) ? ['#d1d5db', '#9ca3af'] : ['#8b5cf6', '#7c3aed']}
            style={styles.addMoneyButtonGradient}
          >
            <Text style={styles.addMoneyButtonText}>
              {isLoading ? 'Processing...' : 'Add Money'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

// Add Card Modal Component
const AddCardModal = ({ visible, onClose, onAddCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    if (match) {
      const formatted = match.join(' ');
      if (formatted.length <= 19) {
        setCardNumber(formatted);
      }
    } else {
      setCardNumber('');
    }
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      const formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
      setExpiryDate(formatted);
    } else {
      setExpiryDate(cleaned);
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid 3-digit CVV');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cardData = {
      number: cardNumber,
      expiry: expiryDate,
      cvv: cvv,
      name: cardholderName,
      lastFour: cardNumber.slice(-4),
    };
    
    onAddCard(cardData);
    setIsLoading(false);
    
    // Reset form
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    onClose();
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Add Debit Card">
      <View style={styles.addCardModalContent}>
        <View style={styles.cardPreview}>
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.cardPreviewGradient}
          >
            <Text style={styles.cardPreviewNumber}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>
            <View style={styles.cardPreviewBottom}>
              <Text style={styles.cardPreviewName}>
                {cardholderName || 'CARDHOLDER NAME'}
              </Text>
              <Text style={styles.cardPreviewExpiry}>
                {expiryDate || 'MM/YY'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardFormSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={cardNumber}
                onChangeText={formatCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                maxLength={19}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.cardDetailsRow}>
            <View style={[styles.inputContainer, styles.cardDetailInput]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={expiryDate}
                  onChangeText={formatExpiryDate}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, styles.cardDetailInput]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addCardButton, (!cardNumber || !expiryDate || !cvv || !cardholderName || isLoading) && styles.addCardButtonDisabled]}
          onPress={handleAddCard}
          disabled={!cardNumber || !expiryDate || !cvv || !cardholderName || isLoading}
        >
          <LinearGradient
            colors={(!cardNumber || !expiryDate || !cvv || !cardholderName || isLoading) ? ['#d1d5db', '#9ca3af'] : ['#8b5cf6', '#7c3aed']}
            style={styles.addCardButtonGradient}
          >
            <Text style={styles.addCardButtonText}>
              {isLoading ? 'Adding Card...' : 'Add Card'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

// Profile Screen Component
const ProfileScreen = ({ visible, onClose, userProfile, onUpdateProfile }) => {
  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedProfile = {
      firstName,
      lastName,
      email,
      phone,
    };
    
    onUpdateProfile(updatedProfile);
    setIsLoading(false);
    setIsEditing(false);
  };

  const settingsOptions = [
    { id: 'notifications', name: 'Notifications', icon: 'notifications-outline', hasSwitch: true },
    { id: 'security', name: 'Security & Privacy', icon: 'shield-checkmark-outline', hasSwitch: false },
    { id: 'cards', name: 'Manage Cards', icon: 'card-outline', hasSwitch: false },
    { id: 'support', name: 'Help & Support', icon: 'help-circle-outline', hasSwitch: false },
    { id: 'about', name: 'About Koso', icon: 'information-circle-outline', hasSwitch: false },
  ];

  return (
    <CustomModal visible={visible} onClose={onClose} title="Profile">
      <ScrollView style={styles.profileModalContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.profileImageGradient}
            >
              <Text style={styles.profileImageText}>
                {firstName.charAt(0)}{lastName.charAt(0)}
              </Text>
            </LinearGradient>
            <TouchableOpacity style={styles.profileImageEdit}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{firstName} {lastName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        {/* Profile Form */}
        <View style={styles.profileFormSection}>
          <View style={styles.profileFormHeader}>
            <Text style={styles.profileFormTitle}>Personal Information</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileFormFields}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <Text style={styles.inputLabel}>First Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={isEditing}
                    placeholder="First name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, styles.nameInput]}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                    value={lastName}
                    onChangeText={setLastName}
                    editable={isEditing}
                    placeholder="Last name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  placeholder="Email address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  placeholder="Phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {isEditing && (
              <TouchableOpacity
                style={[styles.saveProfileButton, isLoading && styles.saveProfileButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#d1d5db', '#9ca3af'] : ['#8b5cf6', '#7c3aed']}
                  style={styles.saveProfileButtonGradient}
                >
                  <Text style={styles.saveProfileButtonText}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Settings</Text>
          {settingsOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={styles.settingsItemIcon}>
                  <Ionicons name={option.icon} size={20} color="#8b5cf6" />
                </View>
                <Text style={styles.settingsItemName}>{option.name}</Text>
              </View>
              {option.hasSwitch ? (
                <View style={styles.switchContainer}>
                  <View style={styles.switch}>
                    <View style={styles.switchThumb} />
                  </View>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.profileBottomSpacing} />
      </ScrollView>
    </CustomModal>
  );
};

// Goal Contribution Modal Component (keeping existing)
const GoalContributionModal = ({ visible, onClose, goal, onContribute, totalBalance }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [1000, 2500, 5000, 10000];

  const handleContribute = async () => {
    const contributionAmount = parseInt(amount.replace(/,/g, ''));
    
    if (!contributionAmount || contributionAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (contributionAmount > totalBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onContribute(goal.id, contributionAmount);
    setIsLoading(false);
    setAmount('');
    onClose();
  };

  const formatInputAmount = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue) {
      const formatted = parseInt(numericValue).toLocaleString();
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  const setQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toLocaleString());
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title={`Add to ${goal?.name} Goal`}>
      <View style={styles.goalModalContent}>
        <View style={styles.goalInfo}>
          <View style={[styles.goalIconContainer, { backgroundColor: goal?.color + '20' }]}>
            <Ionicons name={goal?.icon} size={24} color={goal?.color} />
          </View>
          <View style={styles.goalDetails}>
            <Text style={styles.goalName}>{goal?.name}</Text>
            <Text style={styles.goalProgress}>
              ₦{goal?.current?.toLocaleString()} of ₦{goal?.target?.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.amountInputSection}>
          <Text style={styles.inputLabel}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={formatInputAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <Text style={styles.balanceInfo}>
            Available balance: ₦{totalBalance.toLocaleString()}
          </Text>
        </View>

        <View style={styles.quickAmountsSection}>
          <Text style={styles.quickAmountsLabel}>Quick amounts</Text>
          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setQuickAmount(quickAmount)}
              >
                <Text style={styles.quickAmountText}>₦{quickAmount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.contributeButton, (!amount || isLoading) && styles.contributeButtonDisabled]}
          onPress={handleContribute}
          disabled={!amount || isLoading}
        >
          <LinearGradient
            colors={(!amount || isLoading) ? ['#d1d5db', '#9ca3af'] : ['#8b5cf6', '#7c3aed']}
            style={styles.contributeButtonGradient}
          >
            <Text style={styles.contributeButtonText}>
              {isLoading ? 'Processing...' : 'Add to Goal'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

// Withdrawal Modal Component (keeping existing)
const WithdrawalModal = ({ visible, onClose, totalBalance, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const withdrawalFee = 50;
  const totalDeduction = amount ? parseInt(amount.replace(/,/g, '')) + withdrawalFee : 0;

  const handleWithdraw = async () => {
    const withdrawAmount = parseInt(amount.replace(/,/g, ''));
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (totalDeduction > totalBalance) {
      Alert.alert('Error', 'Insufficient balance (including ₦50 fee)');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onWithdraw(withdrawAmount, withdrawalFee);
    setIsLoading(false);
    setAmount('');
    onClose();
  };

  const formatInputAmount = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue) {
      const formatted = parseInt(numericValue).toLocaleString();
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Withdraw Money">
      <View style={styles.withdrawalModalContent}>
        <View style={styles.amountInputSection}>
          <Text style={styles.inputLabel}>Withdrawal Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={formatInputAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.feeBreakdown}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Withdrawal amount</Text>
            <Text style={styles.feeAmount}>₦{amount || '0'}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Processing fee</Text>
            <Text style={styles.feeAmount}>₦{withdrawalFee.toLocaleString()}</Text>
          </View>
          <View style={styles.feeDivider} />
          <View style={styles.feeRow}>
            <Text style={styles.feeTotalLabel}>Total deduction</Text>
            <Text style={styles.feeTotalAmount}>₦{totalDeduction.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.balanceCheck}>
          <Text style={styles.balanceInfo}>
            Available balance: ₦{totalBalance.toLocaleString()}
          </Text>
          {totalDeduction > totalBalance && (
            <Text style={styles.insufficientBalance}>Insufficient balance</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.withdrawButton, (!amount || isLoading || totalDeduction > totalBalance) && styles.withdrawButtonDisabled]}
          onPress={handleWithdraw}
          disabled={!amount || isLoading || totalDeduction > totalBalance}
        >
          <LinearGradient
            colors={(!amount || isLoading || totalDeduction > totalBalance) ? ['#d1d5db', '#9ca3af'] : ['#ef4444', '#dc2626']}
            style={styles.withdrawButtonGradient}
          >
            <Text style={styles.withdrawButtonText}>
              {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(45750);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [pendingFees, setPendingFees] = useState(200);
  const [userName, setUserName] = useState('John');
  const [activeTab, setActiveTab] = useState('home');
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const [addCardModalVisible, setAddCardModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });

  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
  });

  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Food',
      target: 30000,
      current: 18500,
      frequency: 'Monthly',
      icon: 'restaurant-outline',
      color: '#10b981',
    },
    {
      id: 2,
      name: 'House Rent',
      target: 500000,
      current: 125000,
      frequency: 'Yearly',
      icon: 'home-outline',
      color: '#f59e0b',
    },
    {
      id: 3,
      name: 'School Fees',
      target: 150000,
      current: 89000,
      frequency: 'Semester',
      icon: 'school-outline',
      color: '#ef4444',
    },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, type: 'deposit', amount: 5000, date: '2024-01-15', description: 'Salary deposit' },
    { id: 2, type: 'withdrawal', amount: 2000, date: '2024-01-14', description: 'Emergency withdrawal', fee: 50 },
    { id: 3, type: 'goal', amount: 3000, date: '2024-01-13', description: 'Food goal contribution' },
  ]);

  const showNotification = (message, type = 'success') => {
    setNotification({ visible: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ visible: false, message: '', type: 'success' });
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddMoney = (amount, method) => {
    setTotalBalance(prev => prev + amount);
    const newTransaction = {
      id: Date.now(),
      type: 'deposit',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      description: `Money added via ${method}`,
    };
    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
    showNotification(`₦${amount.toLocaleString()} added successfully!`, 'success');
  };

  const handleWithdraw = (amount, fee) => {
    setTotalBalance(prev => prev - amount - fee);
    const newTransaction = {
      id: Date.now(),
      type: 'withdrawal',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      description: 'Withdrawal',
      fee: fee,
    };
    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
    showNotification(`₦${amount.toLocaleString()} withdrawn successfully!`, 'success');
  };

  const handleAddCard = (cardData) => {
    showNotification(`Card ending in ${cardData.lastFour} added successfully!`, 'success');
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setUserName(updatedProfile.firstName);
    showNotification('Profile updated successfully!', 'success');
  };

  const handleGoalContribution = (goal) => {
    setSelectedGoal(goal);
    setGoalModalVisible(true);
  };

  const contributeToGoal = (goalId, amount) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, current: goal.current + amount }
          : goal
      )
    );
    setTotalBalance(prev => prev - amount);
    const goalName = goals.find(g => g.id === goalId)?.name;
    showNotification(`₦${amount.toLocaleString()} added to ${goalName} goal!`, 'success');
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const navigationItems = [
    { id: 'home', name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'insights', name: 'Insights', icon: 'analytics-outline', activeIcon: 'analytics' },
    { id: 'blog', name: 'Blog', icon: 'library-outline', activeIcon: 'library' },
    { id: 'profile', name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'profile') {
      setProfileModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9ff', '#f0f2ff', '#e8ebff']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{userName}! 👋</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              {pendingFees > 0 && <View style={styles.notificationDot} />}
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.balanceGradient}
            >
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Total Savings</Text>
                <TouchableOpacity onPress={toggleBalanceVisibility}>
                  <Ionicons 
                    name={balanceVisible ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {balanceVisible ? formatCurrency(totalBalance) : '₦••••••'}
              </Text>
              
              {/* Monthly Fee Status */}
              <View style={styles.feeStatus}>
                {totalBalance >= 2500 ? (
                  <View style={styles.feeInfo}>
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text style={styles.feeText}>Monthly fee: ₦100 (Active)</Text>
                  </View>
                ) : (
                  <View style={styles.feeInfo}>
                    <Ionicons name="warning" size={16} color="#f59e0b" />
                    <Text style={styles.feeText}>Below ₦2,500 minimum</Text>
                  </View>
                )}
              </View>

              {pendingFees > 0 && (
                <View style={styles.pendingFees}>
                  <Text style={styles.pendingFeesText}>
                    Pending fees: {formatCurrency(pendingFees)}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setAddMoneyModalVisible(true)}>
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => setWithdrawalModalVisible(true)}>
              <View style={styles.actionIcon}>
                <Ionicons name="arrow-down" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => setAddCardModalVisible(true)}>
              <View style={styles.actionIcon}>
                <Ionicons name="card" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>Add Card</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="receipt-outline" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>Pay Bills</Text>
            </TouchableOpacity>
          </View>

          {/* Goals Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '20' }]}>
                      <Ionicons name={goal.icon} size={20} color={goal.color} />
                    </View>
                    <View style={styles.goalDetails}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalFrequency}>{goal.frequency}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.addToGoalButton}
                    onPress={() => handleGoalContribution(goal)}
                  >
                    <Ionicons name="add" size={16} color="#8b5cf6" />
                  </TouchableOpacity>
                </View>

                <View style={styles.goalProgress}>
                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalCurrent}>{formatCurrency(goal.current)}</Text>
                    <Text style={styles.goalTarget}>of {formatCurrency(goal.target)}</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${getProgressPercentage(goal.current, goal.target)}%`,
                            backgroundColor: goal.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressPercentage}>
                      {Math.round(getProgressPercentage(goal.current, goal.target))}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={
                      transaction.type === 'deposit' ? 'arrow-down' :
                      transaction.type === 'withdrawal' ? 'arrow-up' : 'target'
                    } 
                    size={20} 
                    color={
                      transaction.type === 'deposit' ? '#10b981' :
                      transaction.type === 'withdrawal' ? '#ef4444' : '#8b5cf6'
                    } 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.type === 'deposit' ? '#10b981' : '#ef4444' }
                  ]}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                  {transaction.fee && (
                    <Text style={styles.transactionFee}>Fee: ₦{transaction.fee}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Spacing for Navigation */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
            style={styles.navGradient}
          >
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.navItem}
                onPress={() => handleTabPress(item.id)}
              >
                <View style={[
                  styles.navIconContainer,
                  activeTab === item.id && styles.navIconActive
                ]}>
                  <Ionicons
                    name={activeTab === item.id ? item.activeIcon : item.icon}
                    size={24}
                    color={activeTab === item.id ? '#8b5cf6' : '#9ca3af'}
                  />
                </View>
                <Text style={[
                  styles.navLabel,
                  activeTab === item.id && styles.navLabelActive
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>

        {/* Notification Toast */}
        <NotificationToast
          visible={notification.visible}
          message={notification.message}
          type={notification.type}
          onHide={hideNotification}
        />

        {/* Modals */}
        <AddMoneyModal
          visible={addMoneyModalVisible}
          onClose={() => setAddMoneyModalVisible(false)}
          onAddMoney={handleAddMoney}
        />

        <AddCardModal
          visible={addCardModalVisible}
          onClose={() => setAddCardModalVisible(false)}
          onAddCard={handleAddCard}
        />

        <ProfileScreen
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
        />

        <GoalContributionModal
          visible={goalModalVisible}
          onClose={() => setGoalModalVisible(false)}
          goal={selectedGoal}
          onContribute={contributeToGoal}
          totalBalance={totalBalance}
        />

        <WithdrawalModal
          visible={withdrawalModalVisible}
          onClose={() => setWithdrawalModalVisible(false)}
          totalBalance={totalBalance}
          onWithdraw={handleWithdraw}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  balanceGradient: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  feeStatus: {
    marginBottom: 8,
  },
  feeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
  },
  pendingFees: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pendingFeesText: {
    fontSize: 12,
    color: '#fecaca',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalDetails: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  goalFrequency: {
    fontSize: 14,
    color: '#6b7280',
  },
  addToGoalButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalProgress: {
    gap: 8,
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalCurrent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  goalTarget: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    minWidth: 35,
    textAlign: 'right',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  transactionDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionFee: {
    fontSize: 12,
    color: '#9ca3af',
  },
  bottomSpacing: {
    height: 100,
  },

  // Notification Toast Styles
  notificationToast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },

  // Bottom Navigation Styles
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navGradient: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  navLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#8b5cf6',
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // Add Money Modal Styles
  addMoneyModalContent: {
    paddingTop: 20,
  },
  amountInputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b7280',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  minimumAmount: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  balanceInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  quickAmountsSection: {
    marginBottom: 24,
  },
  quickAmountsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  paymentMethodsSection: {
    marginBottom: 32,
  },
  paymentMethodsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentMethodSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f8f9ff',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodIconSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#8b5cf6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8b5cf6',
  },
  addMoneyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addMoneyButtonDisabled: {
    opacity: 0.6,
  },
  addMoneyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoneyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  // Add Card Modal Styles
  addCardModalContent: {
    paddingTop: 20,
  },
  cardPreview: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardPreviewGradient: {
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  cardPreviewNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    marginTop: 20,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
  },
  cardPreviewExpiry: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardFormSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  textInputDisabled: {
    color: '#9ca3af',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardDetailInput: {
    flex: 1,
  },
  addCardButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addCardButtonDisabled: {
    opacity: 0.6,
  },
  addCardButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  // Profile Modal Styles
  profileModalContent: {
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  profileImageEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
  },
  profileFormSection: {
    marginBottom: 32,
  },
  profileFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  profileFormFields: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  saveProfileButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveProfileButtonDisabled: {
    opacity: 0.6,
  },
  saveProfileButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveProfileButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  switchContainer: {
    padding: 4,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  profileBottomSpacing: {
    height: 40,
  },

  // Goal Contribution Modal Styles
  goalModalContent: {
    paddingTop: 20,
  },
  goalProgress: {
    fontSize: 14,
    color: '#6b7280',
  },
  contributeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  contributeButtonDisabled: {
    opacity: 0.6,
  },
  contributeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contributeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  // Withdrawal Modal Styles
  withdrawalModalContent: {
    paddingTop: 20,
  },
  feeBreakdown: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  feeTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  feeTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  balanceCheck: {
    marginBottom: 24,
  },
  insufficientBalance: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
    marginTop: 4,
  },
  withdrawButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  withdrawButtonDisabled: {
    opacity: 0.6,
  },
  withdrawButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});