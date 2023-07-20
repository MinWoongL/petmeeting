# 삼인성호팀

## 9기 3팀 gitlab repository

<br></br>

## PR & Commit Message Rule

### Pull Request
- 명령 / 스프린트 명 / 이름

### Commit Message
- 명령 / 스토리 또는 테스크 / 내용

### Command keyword
- :heavy_plus_sign: ADD : 파일, 디렉토리 추가
- :black_nib: MOD : 파일 수정 (파일명 수정도)
- :scissors: DEL : 파일, 디렉토리 삭제
- :open_file_folder: MOVE : 파일, 디렉토리 이동
- :boom: MERGE : 브랜치 충돌 후 직접 Merge

## Branch Rule

### Branch classification
- master: 배포 가능한 안정된 버전
- develop: 기능 개발중인 브랜치, 모든 기능 개발은 develop의 하위 브랜치에서 진행
- feature: 개발중인 기능명으로 브랜치 생성, 영문 소문자와 언더바(_)로 구성

예시
> master <br/>
> develop <br/>
> &nbsp; └ frontend <br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └ login <br/>
> &nbsp; └ backend <br/>
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └ reservation <br/>

### Git branch 사용법

- 현재 branch 확인<br/>
  `git branch`
- 새로운 branch 생성하기<br/>
  `git branch 브랜치명`
- branch 이동하기<br/>
  `git switch 브랜치명`
- branch를 생성하면서 이동하기<br/>
  `git switch -c 브랜치명`
- 변경사항 복원하기<br/>
  `git restore 파일명`
- branch 삭제하기<br/>
  `git branch -d 브랜치명`
- branch push하기<br/>
  `git push -u origin 브랜치명` (원격 레포지토리에 브랜치가 없을 때)<br/>
  `git push`


# 📝DB 네이밍 컨벤션
<details>
<summary>📌 DB 네이밍 컨벤션</summary>

## **1. 테이블 및 기타 관계는 단수형을 사용한다**

## **2. 테이블명 설정시 예약어, 약어는 피한다**


- 유기견 놀이 예약테이블 : ~~RV-devise~~ -> reservation-device


## **3. 테이블명은 소문자로 작성한다**
```
- 두 개 이상의 단어를 조합해서 쓸 때는 스네이크케이스로 쓴다.
- 한 단어일때는 소문자로 적는다.
```

## **4. 필드명은 스네이크 케이스 사용한다**
```
유기견 테이블 - 몸무게 : weight
```

## **5. 기본키 필드는 `접두어_no` 형식을 사용한다**
```
유기견놀이예약고유번호 : reservation_device_no
```

## **6. 외래키 필드이름은 참조한 테이블의 기본키 필드명을 사용한다**
```
입양후기게시판(post) 에서 이용자(member) 참조
-> 외래키 명 : member_no
```
</details>

---
## `DB 명명 규칙의 중요성`

#### ☑️ 이름은 오래간다.

데이터 구조는 일반적으로 어플리케이션 코드보다 훨씬 지속력이 높아 **영향력이 오래간다.**

#### ☑️ 이름은 계약이다.

한번 컬럼이나 테이블 이름을 정해 놓으면 개발 단계에서는 그 이름을 그대로 사용하기 때문에
**만약 컬럼과 테이블의 이름이 변경된다면 의존하고 있던 코드에서도 수정**이 일어나야 한다.

#### ☑️ 개발자 환경의 차이.

이름이 잘 정의된 테이블, 컬럼이 있다면 **개발자 본인과 다른 개발자들도 DB구조를 이해하는데 적은 시간이 소요된다.**