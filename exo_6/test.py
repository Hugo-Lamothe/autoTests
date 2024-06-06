from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialiser le navigateur
driver = webdriver.Chrome()

# Naviguer vers Google
driver.get("https://www.google.com")

# Attendre que la pop-up de consentement soit présente
try:
    accept_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//div[@class='QS5gu sy4vM' and contains(text(), 'Tout accepter')]")))

    # Cliquer sur le bouton "Tout accepter"
    accept_button.click()
except:
    print("Pas de pop-up de consentement")

# Trouver la barre de recherche et saisir le terme de recherche
search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("automatisation des tests logiciels")
search_box.send_keys(Keys.RETURN)

# Attendre que les résultats de recherche soient chargés
wait = WebDriverWait(driver, 10)
wait.until(EC.presence_of_element_located((By.ID, "search")))

# Vérifier que les résultats contiennent le terme de recherche
results = driver.find_elements(By.XPATH, "//h3")
# Récupérer le texte de chaque titre
reuslts_text = [title.text for title in results]

# Afficher le texte des titres
print("Texte des titres :")
for result_text in reuslts_text:
    print(result_text)


# Fermer le navigateur
driver.quit()